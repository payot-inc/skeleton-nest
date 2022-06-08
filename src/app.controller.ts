import { Controller, Get, Version } from '@nestjs/common';
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

@Controller({
  version: '1',
})
export class AppController {
  @Get()
  async metadataV1() {
    const text = await promisify(readFile)(join(__dirname, '..', 'package.json'), 'utf-8');
    return JSON.parse(text);
  }

  @Version('2')
  @Get()
  async metadataV2() {
    const text = await promisify(readFile)(join(__dirname, '..', 'package.json'), 'utf-8');
    return JSON.parse(text).version;
  }
}
