declare module "sslcommerz-lts" {
  interface SSLInitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    [key: string]: unknown;
  }

  interface SSLInitResponse {
    GatewayPageURL?: string;
    [key: string]: unknown;
  }

  interface SSLValidateResponse {
    status?: string;
    amount?: string | number;
    [key: string]: unknown;
  }

  export default class SSLCommerzPayment {
    constructor(store_id: string, store_passwd: string, is_live: boolean);
    init(data: SSLInitData): Promise<SSLInitResponse>;
    validate(data: { val_id: string }): Promise<SSLValidateResponse>;
  }
}
