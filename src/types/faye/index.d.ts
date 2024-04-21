declare module 'faye' {
  export declare let Faye: any;
  export interface MessageBody {
    id?: string;
    channel: string;
    data?: any;
    ext: {
      authToken: string;
    };
    error?: string | Error;
    [key: string]: any;
  }

  export interface Deferrable {
    then(callback: Function, errback: Function): void;
    callback(callback: Function, errback: Function): void;
    errback(callback: Function, errback?: Function): void;
  }

  export interface Subscription extends Deferrable {
    withChannel(
      callback: (channel: string, message: MessageBody) => void
    ): void;
    cancel(): void;
  }

  export interface Publication extends Deferrable {}

  export type ClientFeature =
    | 'websocket'
    | 'long-polling'
    | 'callback-polling'
    | 'in-process'
    | 'autodisconnect';

  export type ClientEventType = 'transport:up' | 'transport:down';

  export interface ClientOptions {
    timeout?: number;
    retry?: number;
    endpoints?: { websocket: string };
  }
  export interface ISchedulerOptions {
    interval?: number;
    timeout?: number;
    deadline?: number;
    attempts?: number;
  }

  export interface IScheduler {
    message: MessageBody;
    attempts: number;
    options?: ISchedulerOptions;
    send(): void;
    getInterval(): number;
    isDeliverable(): boolean;
    succeed(): void;
    fail(): void;
    abort(): void;
  }
  export interface DispatchOptions {
    attempts?: number;
    deadline?: number;
    scheduler?: IScheduler;
  }
  export type ClientExtension = {
    incoming?: (message: MessageBody, callback: Function) => void;
    // incoming: (message: MessageBody,request:any,  callback: Function)=>void;
    outgoing?: (message: MessageBody, callback: Function) => void;
    // outgoing: (message: MessageBody, response:any,  callback: Function)=>void;
  };

  export interface IClient {
    disable: (feature: ClientFeature) => void;
    setHeader: (key: string, value: string) => void;
    subscribe: (
      channel: string,
      handler: (message: MessageBody) => void,
      context?: object
    ) => Subscription;
    publish: (
      channel: string,
      message: MessageBody,
      options?: DispatchOptions
    ) => Publication;
    addExtension: (extension: ClientExtension) => void;

    on: (type: ClientEventType, handler: Function) => void;
  }
  export interface ClientConstructor {
    new (url: string): IClient;
    new (url: string, options: ClientOptions): IClient;
  }
}
