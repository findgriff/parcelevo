type SendArgs = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};
export declare class EmailChannel {
    private transporter?;
    constructor();
    send({ to, subject, text, html }: SendArgs): Promise<void>;
}
export {};
