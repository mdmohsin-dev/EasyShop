import SSLCommerzPayment from "sslcommerz-lts";

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

export function getSslClient() {
  return new SSLCommerzPayment(store_id, store_passwd, is_live);
}
