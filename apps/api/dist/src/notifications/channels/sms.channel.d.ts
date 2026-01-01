export type SmsPayload = {
    to: string;
    text: string;
};
export declare class SmsChannel {
    send(payload: SmsPayload): Promise<void>;
}
