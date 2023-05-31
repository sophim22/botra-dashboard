import { pick } from "../helper/utils";

export const profileSerializer = account => {
  account.profile = account.profileUrl;
  account.id = account.uuid;
  account.account_number = account.displayAccountNumber;

  return pick(account, [
    "id",
    "name",
    "phone",
    "email",
    "username",
    "provider",
    "profile",
    "phone_verify",
    "account_number",
  ]);
};
