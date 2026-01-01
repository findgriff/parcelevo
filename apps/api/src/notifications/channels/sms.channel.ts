import { Injectable } from '@nestjs/common';

export type SmsPayload = {
  to: string;
  text: string;
};

@Injectable()
export class SmsChannel {
  async send(payload: SmsPayload) {
    console.log(`[DEV SMS] to=${payload.to} text=${payload.text}`);
  }
}
