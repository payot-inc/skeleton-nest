import { BizmService } from '@app/bizm';
import { Controller, Get } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly bizmService: BizmService) {}

  @Get()
  getHello() {
    const path = join(__dirname, 'assets', 'test.txt');
    return this.bizmService
      .generateMessage(path, {
        title: '타이틀',
        user: {
          name: '홍길동',
          phone: '010-0000-0000',
          address: ['주소', '상세주소'],
        },
        msg: new Date(),
      })
      .then((text) => text.replace(/\n/g, '<br />'));
  }
}
