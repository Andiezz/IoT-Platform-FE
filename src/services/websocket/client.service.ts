import { SocketClient } from 'src/websocket/client';
import { ISocketClient, MessageHandler } from 'src/websocket/interfaces';
import { SUBSCRIPTION_CHANNEL_PREFIX } from 'src/constants/subscription';
import { ClientExtension, MessageBody, Subscription } from 'faye';
import { WS_URL } from 'src/environments/environment';
import { IHttpService } from '../http.service';

export interface IClientService {
  userId?: string;
  authToken?: string;
  messageHandlers?: MessageHandler[];
  connect: () => void;
  disconnect: () => void;
  publish: (channel: string, msg: MessageBody) => void;
  subscribeChannel: (channel: string, v: MessageHandler[]) => Promise<void>;
  unScribeChannel: (channel: string) => void;
  refreshToken(token: string): void;
}

export class ClientService implements IClientService {
  private client?: ISocketClient;
  private connected = false;

  constructor(
    private httpService: IHttpService,
    public userId?: string,
    public authToken?: string,
    public messageHandlers?: MessageHandler[]
  ) {}

  public connect(): void {
    if(!this.userId || !this.authToken || !this.messageHandlers || this.connected){
      return;
    }
    const handlers = new Map<string, MessageHandler[]>();
    handlers.set(`${SUBSCRIPTION_CHANNEL_PREFIX}/${this.userId}/*`, this.messageHandlers);
    const extensions: ClientExtension[] = [];
    const ext: ClientExtension = {
      
      outgoing: (message: MessageBody, callback: Function)=>{
        if(message.channel !== '/meta/subscribe'){
          return callback(message);
        }
        if(!message.ext){
          message.ext = {
            authToken: ''
          }
        }

        message.ext.authToken = this.authToken || '';
        callback(message);
      }
    };
    extensions.push(ext);

    this.client = new SocketClient({
      url: WS_URL,
      handlers,
      extensions,
      options: {
        timeout: 60,
        retry: 1
      }
    });
    this.connected = true;
  }

  public refreshToken(token: string): void {
    this.authToken = token;
    this.client?.addExtension({
      outgoing: (message: MessageBody, callback: Function) => {
        if (message.channel !== '/meta/subscribe') {
          return callback(message);
        }
        if (!message.ext) {
          message.ext = {
            authToken: ''
          };
        }
        message.ext.authToken = token || '';
        callback(message);
      }
    });
  }

  public async subscribeChannel(channel: string, v: MessageHandler[]) {
    if (this.client) {
      const subscription: Subscription = this.client?.subscribeChannel(
        channel,
        v
      );
      await subscription?.errback(
        async (messageError: { message: { name?: string } }) => {
          if (messageError.message.name === 'TokenExpiredError') {
            await this.httpService.refreshToken().then(() => {
              this.refreshToken(this.httpService.getToken());
              this.client?.subscribeChannel(channel, v);
            });
          }
        }
      );
    }
  }

  public unScribeChannel(channel: string) {
    this.client?.unScribeChannel(channel);
  }

  public publish(channel: string, msg: MessageBody): void {
    this.client && this.client.publish(channel, msg);
  }
  public disconnect(): void {
    this.client && this.client.dispose();
  }
}
