import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Max, ValidateIf, ValidateNested } from 'class-validator';
import * as dayjs from 'dayjs';

export const BIZM_MODULE_CONFIG = 'BIZM_MODULE_CONFIG';

export enum KakaoMessageType {
  ALIM_TALK = 'AT',
  ALIM_TALK_IMAGE = 'AI',
  FRIENDS_TALK = 'FT',
  FRIENDS_TALK_IMAGE = 'FI',
  FRIENDS_TALK_WIDE = 'FW',
}

export enum SMSMessageKind {
  SMS = 'S',
  LMS = 'L',
  MMS = 'M',
  NONE = 'N',
}

export enum SMSMessageButtonType {
  WEB_LINK = 'WL',
  APP_LINK = 'AL',
  DELIVERY_STATE = 'DS',
  BOOT_KEYWORD = 'BT',
  MESSAGE_SEND = 'MD',
  BUSINSS_CHANNAL = 'BC',
  BOOT_TRANSIT = 'BT',
  ADD_CHANNAL = 'AC',
  BISUINSS_FORM = 'BF',
  PICTURE_PLUGIN_1 = 'P1',
  PICTURE_PLUGIN_2 = 'P2',
  ONECLICK_PAY_PLUGIN_1 = 'P3',
}

export class SMSRequestButtonParam {
  name: string;
  type: 'WL' | 'AL' | 'DS' | 'BK' | 'MD';
  url_mobile?: string;
  scheme_ios?: string;
  scheme_android?: string;
  chat_extra?: string;
  chat_event?: string;
  plugin_id?: string;
  relay_id?: string;
  oneclick_id?: string;
  product_id?: string;
}

export class SMSRequestButtonQuicReplyParam {
  @IsNotEmpty()
  @Max(28, { message: '버튼명은 28자를 넘을 수 없습니다' })
  name: string;

  @IsNotEmpty({ message: '버튼타입을 입력해 주세요' })
  @IsEnum(SMSMessageButtonType)
  type: SMSMessageButtonType;

  @IsOptional()
  url_pc?: string;

  @IsOptional()
  scheme_ios?: string;

  @IsOptional()
  scheme_android?: string;
}

export class SMSRequestParam {
  // 메시지 아이디
  @IsString()
  @Length(20)
  msgid?: string;

  @IsNotEmpty()
  @IsEnum(KakaoMessageType)
  message_type: KakaoMessageType;

  // 전송자 프로필키
  @IsString()
  @Length(40)
  profile_key?: string;

  // 알림톡 템플릿 이름
  @ValidateIf((o) => [KakaoMessageType.ALIM_TALK, KakaoMessageType.ALIM_TALK_IMAGE].includes(o.message_type))
  @IsNotEmpty()
  template_code?: string;

  // 사용자 전화번호
  @IsNotEmpty()
  receiver_num: string;

  @IsNotEmpty({ message: '카카오메시지를 입력해주세요' })
  @IsString()
  @Max(1000, { message: '메시지의 내용이 초과하였습니다. (최대 1,000자)' })
  message: string;

  @ValidateIf((_, value) => dayjs(value, 'YYYYMMDDHHmmss').isValid(), { message: '올바른 예약시간을 입력해 주세요(YYYYMMDDHHmmss)' })
  @IsString()
  @Length(14)
  reserved_time = '00000000000000';

  @IsOptional()
  @IsEnum(SMSMessageKind, { message: '올바른 SMS전송 방식을 선택해 주세요' })
  sms_kind?: SMSMessageKind;

  @ValidateIf((o) => o.sms_kind !== SMSMessageKind.NONE)
  @IsNotEmpty()
  @IsEnum(['Y', 'N'])
  sms_only?: 'Y' | 'N' = 'N';

  @ValidateIf((o) => o.sms_kind !== SMSMessageKind.NONE)
  @IsNotEmpty({ message: '발신번호를 입력해 주세요' })
  sender_num?: string;

  @ValidateIf((o) => o.sms_kind !== SMSMessageKind.NONE)
  @IsNotEmpty({ message: 'SMS 제목을 입력해 주세요' })
  @IsString()
  @Max(120, { message: '메시지 내용은 120자를 넘을 수 없습니다' })
  sms_title?: string;

  @ValidateIf((o) => o.sms_kind !== SMSMessageKind.NONE)
  @IsNotEmpty({ message: 'SMS 내용을 입력해 주세요' })
  @Max(2000, { message: 'SMS메시지 내용은 2,000자를 넘을 수 없습니다' })
  sms_message?: string;

  @IsOptional()
  @ValidateNested()
  button1?: SMSRequestButtonParam;

  @IsOptional()
  @ValidateNested()
  button2?: SMSRequestButtonParam;

  @IsOptional()
  @ValidateNested()
  button3?: SMSRequestButtonParam;

  @IsOptional()
  @ValidateNested()
  button4?: SMSRequestButtonParam;

  @IsOptional()
  @ValidateNested()
  button5?: SMSRequestButtonParam;
}

export class SMSResponse {
  msgid: string;
  result: 'Y' | 'N';
  code: string;
  error?: string;
  kind?: 'K' | 'M' | 'P';
}
