// eslint-disable-next-line no-var
// eslint-disable-next-line
export declare let Faye: any;
import type { ClientExtension, IClient, MessageBody, Subscription } from 'faye';

import { ISocketClient, ISocketOptions, MessageHandler } from './interfaces';

export class SocketClient implements ISocketClient {
  private client: IClient;
  private handlers: Map<string, MessageHandler[]>;
  private subscriptions: Subscription[] = [];
  private subscriptionsCustom: Map<string,Subscription> = new Map();
  constructor(socketOptions: ISocketOptions) {
    this.client = new Faye.Client(
      socketOptions.url,
      socketOptions.options || {}
    );
    this.handlers = socketOptions.handlers;

    this.setup();
    this.setupExtensions(socketOptions.extensions);
  }

  private setupExtensions(extensions?: ClientExtension[]): void {
    if (!extensions || extensions.length < 1 || !this.client) {
      return;
    }
    extensions.forEach((extension) => {
      this.client.addExtension(extension);
    });
  }

  private setup(): void {
    if (!this.handlers || this.handlers.size < 1 || !this.client) {
      return;
    }

    this.handlers.forEach((v: MessageHandler[], key: string) => {
      const subscription = this.client.subscribe(
        key,
        (message: MessageBody) => {
          if (v && v.length) {
            v.forEach((cb) => {
              cb.onMessage(message, key);
            });
          }
        }
      );

      this.subscriptions.push(subscription);
    });
  }
  public subscribeChannel(channel: string, v: MessageHandler[]): Subscription{
    const subscription =  this.client.subscribe(channel,(message: MessageBody) => {
      if (v && v.length) {
        v.forEach((cb) => {
          cb.onMessage(message, channel);
        });
      }
    })
    this.subscriptionsCustom.set(channel,subscription);
    return subscription;
  }

  public unScribeChannel(channel: string){
    const subscription = this.subscriptionsCustom.get(channel)
    if(subscription){
      subscription.cancel();
    }
  }

  public publish(channel: string, message: MessageBody): void {
    this.client.publish(channel, message);
  }
  
  public addExtension (extension: ClientExtension): void{
    console.log('add Extension')
    this.client.addExtension(extension)
  }
   
  public dispose(): void {
    this.subscriptions.forEach((s) => {
      s.cancel();
    });
  }
}
