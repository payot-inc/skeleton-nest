import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { BizmConfig } from './bizm.module';
import { BIZM_MODULE_CONFIG, SMSRequestParam, SMSResponse } from './bizm.type';
import { chunk, flatten, get } from 'lodash';
import { nanoid } from 'nanoid';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as dayjs from 'dayjs';

@Injectable()
export class BizmService {
  private client: AxiosInstance;

  constructor(@Inject(BIZM_MODULE_CONFIG) private readonly config: BizmConfig) {
    this.client = axios.create({
      baseURL: 'https://alimtalk-api.sweettracker.net',
      headers: {
        ['Content-Type']: 'application/json',
        userid: config.userid,
      },
    });
  }

  private convertPhoneNumber(numbers: string) {
    return numbers.trim().replace(/-/g, '').replace(/^010/, '8210');
  }

  /**
   * 싱글 전송
   *
   * @param param
   * @returns
   */
  async send(param: SMSRequestParam): Promise<SMSResponse> {
    return this.sendMultiple([param]).then((result) => result[0]);
  }

  /**
   * 다중 전송
   *
   * @param params
   * @returns
   */
  async sendMultiple(params: SMSRequestParam[]): Promise<SMSResponse[]> {
    const forms = params.map((value) =>
      Object.assign(value, {
        msgid: nanoid(20),
        sender_num: this.convertPhoneNumber(value.sender_num),
        profile_key: this.config.profile,
      }),
    );
    const result = await Promise.all(
      chunk(forms, 100).map((value) => {
        return this.client
          .request<SMSResponse[]>({
            method: 'POST',
            url: `/v2/${this.config.profile}/sendMessage`,
            data: value,
          })
          .then((res) => res.data);
      }),
    );

    return flatten(result);
  }

  async generateMessage(filePath: string, content: any, dateFormat = 'YYYY-MM-DD'): Promise<string> {
    const template = await promisify(readFile)(filePath, 'utf-8');
    const matchParams = template.match(/[^{\}]+(?=})/g);
    const result = matchParams.reduce((acc: string, param: string) => {
      const key = param.replace(/\{/g, '').replace('}', '').split('.');
      const regex = new RegExp(`{${param}}`, 'g');
      let value = get(content, key) ?? '';

      if (value instanceof Date) {
        value = dayjs(value).format(dateFormat);
      }

      return acc.replace(regex, value);
    }, template);

    return result;
  }
}
