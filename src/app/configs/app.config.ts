export default class AppConfig {
  environment: string;
  port: any;
  host: string;
  access_token_private_key: string;
  access_token_public_key: string;
  refresh_token_private_key: string;
  refresh_token_public_key: string;
  max_retry_api: any;
  max_retry_time_limit: any;
  max_retry_limit_message: string;
  accessTokenTtl: string;
  refreshTokenTtl: string;

  // for SMS Service
  sms_user: string;
  sms_pass: string;
  sms_senderid: string;
  sms_templateid: string;

  constructor() {
    this.environment = process.env.NODE_ENV;
    this.port = process.env.PORT || 3005;
    this.host = "http://localhost:" + this.port;
    //this.host = "https://apiz.auroscholar.org";
    this.access_token_private_key = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    this.access_token_public_key = process.env.ACCESS_TOKEN_PUBLIC_KEY;
    this.refresh_token_private_key = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    this.refresh_token_public_key = process.env.REFRESH_TOKEN_PUBLIC_KEY;
    this.max_retry_api = process.env.MAX_RETRY_API;
    this.max_retry_time_limit = process.env.MAX_RETRY_TIME_LIMIT;
    this.max_retry_limit_message = process.env.MAX_RETRY_LIMIT_MESSAGE;
    this.accessTokenTtl = process.env.ACCESS_TOKEN_TTL;
    this.refreshTokenTtl = process.env.REFRESH_TOKEN_TTL;
    this.sms_user = "auroscotp";
    this.sms_pass = "Nsts@321";
    this.sms_senderid = "AUROSC";
    this.sms_templateid = "1507164620315663224";
  }
}
