import { NotificationEvent } from '../types';
export type NotificationProcessor = (event: NotificationEvent) => Promise<void>;
export interface NotifyQueue {
    enqueue(event: NotificationEvent): Promise<void>;
    depth(): Promise<number>;
    close(): Promise<void>;
}
export declare class BullMqNotifyQueue implements NotifyQueue {
    private readonly connection;
    private readonly queue;
    private readonly worker;
    constructor(processor: NotificationProcessor);
    enqueue(event: NotificationEvent): Promise<void>;
    depth(): Promise<number>;
    close(): Promise<void>;
}
export declare class InMemoryNotifyQueue implements NotifyQueue {
    private readonly processor;
    private readonly queue;
    private running;
    private stopped;
    constructor(processor: NotificationProcessor);
    enqueue(event: NotificationEvent): Promise<void>;
    depth(): Promise<number>;
    close(): Promise<void>;
    private schedule;
    private drain;
}
