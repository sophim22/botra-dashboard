import "dotenv/config";
import { Model } from "objection";

class OtpToken extends Model {
  static get tableName() {
    return "otp_tokens";
  }
}

export default OtpToken;
