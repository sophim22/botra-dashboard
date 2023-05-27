import "dotenv/config";
import { Model } from "objection";

class Admin extends Model {
  static get tableName() {
    return "admins";
  }
}

export default Admin;
