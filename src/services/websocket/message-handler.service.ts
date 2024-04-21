import { MessageBody } from 'faye';
import { MessageHandler } from 'src/websocket/interfaces';

export class SocketMessageHandler implements MessageHandler{
  public async onMessage (message: MessageBody): Promise<void>{
    console.log(message);
  }
  
}