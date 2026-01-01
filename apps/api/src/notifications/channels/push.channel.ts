import { Injectable } from '@nestjs/common';

export type PushPayload = {
  token: string;
  title: string;
  body: string;
};

@Injectable()
export class PushChannel {
  async send(payload: PushPayload) {
    console.log(`[DEV PUSH] to=${payload.token} title=${payload.title} body=${payload.body}`);
  }
}
