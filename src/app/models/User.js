require("dotenv").config();
import { Model } from "objection";
import bcrypt from "bcrypt";

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get softDelete() {
    return true;
  }

  static relationMappings = {
    device_tokens: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/DeviceToken",
      join: {
        from: "users.id",
        to: "device_tokens.user_id",
      },
    },
  };

  validPassword(password) {
    return bcrypt.compareSync(password, this.password || "");
  }

  static generatePassword = async password => {
    return bcrypt.hashSync(password, 12);
  };

  get imageKey(){
    if (process.env.STORAGE === "s3") {
      return this.profile;
    } 
    return `/uploads/${this.profile}`;
  }

  static generateOtp = () => (process.env.APP_ENV === "production" ? crypto.randomInt(100000, 999999) : 123456);

  static get modifiers() {
    return {
      filter(query, params) {
        if (params.username) {
          query.where("username", "like", `%${params.username}%`);
        }
        if (params.phone) {
          query.where("phone", "like", `%${params.phone}%`);
        }
        if (params.status) {
          query.where("status", "=", `${params.status}`);
        }
      },
    };
  }

  static list = async (params, page = 1, perPage = 20) => {
    const data = await User.query()
      .withGraphFetched("wallet")
      .modify("filter", params)
      .orderBy("updated_at", "desc")
      .page(page, perPage);

    return data;
  };
}

export default User;
