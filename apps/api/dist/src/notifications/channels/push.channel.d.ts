export type PushPayload = {
    token: string;
    title: string;
    body: string;
};
export declare class PushChannel {
    send(payload: PushPayload): Promise<void>;
}
