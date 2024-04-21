import { ClientExtension, ClientOptions, MessageBody, Subscription } from 'faye';
import { MessageHandler } from './message-handler.interface';

export interface ISocketOptions{
  url: string;
  handlers: Map<string, MessageHandler[]>;
  options?: ClientOptions;
  extensions?: ClientExtension[] 
}

export interface ISocketClient{
  dispose: ()=>void;
  subscribeChannel: (channel: string, v: MessageHandler[]) =>  Subscription;
  unScribeChannel: (channel: string) => void;
  publish: (channel: string, message: MessageBody) => void;
  addExtension: (extension: ClientExtension) => void;
}