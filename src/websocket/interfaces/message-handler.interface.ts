import { MessageBody } from 'faye';

export interface MessageHandler{
  onMessage:(message: MessageBody, messageIdentity: any)=> Promise<void> | void;
}