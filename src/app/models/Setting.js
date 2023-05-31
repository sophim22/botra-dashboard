import { Model } from "objection";
import { PolyUtil } from "node-geometry-library";
import { decryptMessage } from "~/config";

class Setting extends Model {
  static get tableName() {
    return "settings";
  }

  static firstOrCreate = async () => {
    let setting = await Setting.query().first();

    if (!setting) {
      const location = [
        { lat: 13.069323, lng: 103.900906 },
        { lat: 12.943545, lng: 104.021756 },
        { lat: 12.817704, lng: 104.153592 },
        { lat: 12.721273, lng: 104.192044 },
        { lat: 12.737347, lng: 104.214016 },
        { lat: 12.788243, lng: 104.214016 },
        { lat: 12.801635, lng: 104.230496 },
        { lat: 12.828417, lng: 104.241482 },
        { lat: 12.871261, lng: 104.277188 },
        { lat: 12.890004, lng: 104.326626 },
        { lat: 12.90339, lng: 104.354092 },
        { lat: 12.924807, lng: 104.373318 },
        { lat: 12.964959, lng: 104.395291 },
        { lat: 12.98637, lng: 104.433743 },
        { lat: 13.010456, lng: 104.461209 },
        { lat: 13.055945, lng: 104.450222 },
        { lat: 13.090725, lng: 104.466702 },
        { lat: 13.176317, lng: 104.477688 },
        { lat: 13.21108, lng: 104.549099 },
        { lat: 13.299303, lng: 104.565579 },
        { lat: 13.368789, lng: 104.568325 },
        { lat: 13.454283, lng: 104.639737 },
        { lat: 13.502359, lng: 104.64523 },
        { lat: 13.531735, lng: 104.678189 },
        { lat: 13.515712, lng: 104.626004 },
        { lat: 13.529065, lng: 104.590298 },
        { lat: 13.529065, lng: 104.554592 },
        { lat: 13.547756, lng: 104.529873 },
        { lat: 13.563777, lng: 104.406277 },
        { lat: 13.598484, lng: 104.40353 },
        { lat: 13.614501, lng: 104.422757 },
        { lat: 13.670552, lng: 104.439236 },
        { lat: 13.689233, lng: 104.430996 },
        { lat: 13.723921, lng: 104.425503 },
        { lat: 13.771943, lng: 104.41177 },
        { lat: 13.80662, lng: 104.384304 },
        { lat: 13.80662, lng: 104.365078 },
        { lat: 13.865291, lng: 104.389798 },
        { lat: 13.897288, lng: 104.41177 },
        { lat: 13.92928, lng: 104.425503 },
        { lat: 13.966598, lng: 104.400784 },
        { lat: 13.966598, lng: 104.334866 },
        { lat: 13.958602, lng: 104.318386 },
        { lat: 13.958602, lng: 104.268948 },
        { lat: 13.92928, lng: 104.21127 },
        { lat: 13.955936, lng: 104.170071 },
        { lat: 13.971929, lng: 104.046475 },
        { lat: 13.969264, lng: 103.659207 },
        { lat: 13.955936, lng: 103.615261 },
        { lat: 13.942609, lng: 103.576809 },
        { lat: 13.913284, lng: 103.56857 },
        { lat: 13.90262, lng: 103.532864 },
        { lat: 13.891955, lng: 103.45596 },
        { lat: 13.854625, lng: 103.428494 },
        { lat: 13.827957, lng: 103.428494 },
        { lat: 13.779946, lng: 103.420254 },
        { lat: 13.745266, lng: 103.420254 },
        { lat: 13.721253, lng: 103.417508 },
        { lat: 13.699907, lng: 103.436734 },
        { lat: 13.65187, lng: 103.401028 },
        { lat: 13.625178, lng: 103.390042 },
        { lat: 13.603823, lng: 103.403775 },
        { lat: 13.558437, lng: 103.412014 },
        { lat: 13.537076, lng: 103.414761 },
        { lat: 13.502359, lng: 103.406521 },
        { lat: 13.464967, lng: 103.409268 },
        { lat: 13.424897, lng: 103.395535 },
        { lat: 13.379477, lng: 103.414761 },
        { lat: 13.366117, lng: 103.425747 },
        { lat: 13.355428, lng: 103.477932 },
        { lat: 13.352755, lng: 103.510891 },
        { lat: 13.318012, lng: 103.557583 },
        { lat: 13.312667, lng: 103.587796 },
        { lat: 13.293957, lng: 103.596035 },
        { lat: 13.299303, lng: 103.628994 },
        { lat: 13.277918, lng: 103.667446 },
        { lat: 13.280592, lng: 103.692166 },
        { lat: 13.237818, lng: 103.714138 },
        { lat: 13.208406, lng: 103.725125 },
        { lat: 13.063972, lng: 103.89815 },
      ];
      const data = PolyUtil.encode(location);

      setting = await Setting.query()
        .insert({
          default_location: {
            latitude: 13.3405053,
            longitude: 103.7929142,
          },
          available_location: {
            data: data,
          },
        })
        .returning("*");
    }
    return setting;
  };
  get smsConfig() {
    const config = this.sms_config;
    const sid = decryptMessage(config.account_sid);
    const token = decryptMessage(config.token);
    return {
      ...config,
      account_sid: sid,
      token,
    };
  }

  get emailConfig() {
    const config = this.email_config;
    const username = decryptMessage(config.username);
    const password = decryptMessage(config.password);
    return {
      ...config,
      username,
      password,
    };
  }
}

export default Setting;
