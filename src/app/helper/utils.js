import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import crypto from "crypto";
import path from "path";
import redis from "../../config/redis";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import numeral from "numeral";
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

function includes(haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

export const getExtension = file => {
  return path.extname(file);
};

export const pagingParams = req => {
  let perPage = req.query.per_page || 20;
  let page = req.query.page || 0;
  if (page >= 1) {
    page -= 1;
  }
  if (isNaN(Number(page))) {
    page = 1;
  }
  if (isNaN(Number(perPage))) {
    perPage = 20;
  }
  return {
    perPage: Number(perPage),
    page,
  };
};

export const adminPagination = (total, perPage, currentPage) => {
  const totalPage = Math.ceil(total / perPage);
  const next = currentPage + 2 <= totalPage ? currentPage + 2 : totalPage;
  const previous = currentPage >= 2 ? currentPage + 1 - 1 : 1;

  return {
    total,
    perPage,
    currentPage: Number(currentPage),
    next,
    totalPage,
    previous,
    pages: [...Array(totalPage).keys()],
  };
};

export const pagination = (length, currentPage, itemsPerPage) => {
  return {
    current_page: currentPage,
    total_pages: Math.ceil(length / itemsPerPage),
    total_count: length,
  };
};

export const paging = req => {
  let page = req.query.page || 1;
  let perPage = req.query.per_page || 20;
  if (isNaN(Number(perPage))) {
    perPage = 20;
  }
  if (isNaN(Number(page))) {
    page - 1;
  }
  if (page - 1 >= 0) {
    page = page - 1;
  }
  return {
    page,
    perPage,
  };
};

export const dateFormat = (date, formater = "yyyy.MM.dd", fallback) => {
  if (!date && fallback) {
    return fallback;
  }
  return dayjs(date).format(formater);
};

export const generateMD5 = value => {
  return crypto.createHash("md5").update(value).digest("hex");
};

export const pick = (data, toPick) => pickBy(data, toPick, (values, v) => includes(values, v));

export const omit = (data, toOmit) => pickBy(data, toOmit, (values, v) => !includes(values, v));

export const pickBy = (data, values, predicate) => {
  return Object.keys(data).reduce((c, v) => {
    if (predicate(values, v)) {
      c[v] = data[v];
      return c;
    }
    return c;
  }, {});
};

export const groupBy = (array, type) => {
  if (!Array.isArray(array)) return array;
  return array.reduce((r, v, i, a, k = v[type]) => ((r[k] || (r[k] = [])).push(v), r), {});
};
export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const isValidUsername = username => {
  return /^[a-z][a-z0-9_.]*$/i.test(username);
};

export const isValidCode = code => {
  return /^[a-z1-9_-]*$/i.test(code);
};

export const validateEmail = email => {
  if (!email) return false;
  if (email.length > 256) return false;
  if (!emailTester.test(email)) return false;
  var [account, address] = email.split("@");
  if (account.length > 64) return false;

  const domainParts = address.split(".");
  if (domainParts.some(part => part.length > 63)) return false;
  return true;
};

export const generateAuthToken = (length = 30) => {
  return crypto.randomBytes(length).toString("hex");
};

export const clearSession = (req, res) => {
  const token = req.cookies["__hair_extension_store_auth__"];
  res.clearCookie("__hair_extension_store_auth__");
  const key = `session:${token}`;
  redis.del(key);
};

export const storeLoginSession = (res, user, isRemember = false, tmp = false) => {
  const token = generateAuthToken();
  const expireInDay = isRemember ? 7 : 2;
  const extDate = tmp ? 3 : 24 * expireInDay;
  const expired = 60 * 60 * extDate;
  const key = `session:${token}`;
  const date = new Date();
  date.setTime(date.getTime() + extDate * 60 * 60 * 1000);

  res.cookie("__hair_extension_store_auth__", token, {
    expires: new Date(date),
    httpOnly: true,
  });

  redis.set(
    key,
    JSON.stringify({
      id: user.id,
      username: user.username,
      allowPasswordChange: user.allowPasswordChange,
    }),
    "EX",
    expired,
  );
};

export const generatePassword = password => {
  return bcrypt.hashSync(password, 12);
};

export const displayPhoneNumber = (phone, countryCode = "kh") => {
  try {
    let phoneNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);
    return phoneUtil.format(phoneNumber, PNF.NATIONAL);
  } catch (er) {
    return phone;
  }
};

export const deepSet = (obj, path, value) =>  {
  if (Object(obj) !== obj) return obj; 
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; 
  path.slice(0,-1).reduce((a, c, i) => 
       Object(a[c]) === a[c]
           ? a[c] 
           : a[c] = Math.abs(path[i+1])>>0 === +path[i+1] 
                 ? [] 
                 : {}, 
       obj)[path[path.length-1]] = value; 
  return obj;
}

export const formDataExtractor  = (data, key) => {
  let  root = {}
  for(let param of data) {
    deepSet(root, param[key], param)
  }
  return root;
} 

export const formatPhoneNumber = (phone, countryCode = "kh") => {
  try {
    let phoneNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);
    phoneNumber = phoneUtil.format(phoneNumber, PNF.E164);

    return phoneNumber;
  } catch (error) {
    return "";
    console.log({ error });
  }
};

export const isPhoneValid = (phone, countryCode = "kh") => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone, countryCode);
    return phoneUtil.isValidNumber(number);
  } catch (error) {
    return false;
  }
};

export const getCountryCode = phone => {
  try {
    const numberProto = phoneUtil.parse(phone);
    const callingCode = numberProto.getCountryCode();
    const nationalNumber = numberProto.getNationalNumber();
    const countryCode = phoneUtil.getRegionCodeForCountryCode(callingCode);
    return { countryCode, phone: nationalNumber.toString() };
  } catch (error) {
    return { countryCode: "US", phone: "" };
  }
};

export function safeJSON(json, fallback = []) {
  var parsed = fallback;
  try {
    parsed = JSON.parse(json);
  } catch (e) {}

  return parsed;
}

export const isAuthorized = (user, action) => {
  if (Array.isArray(action)) {
    return user.role.privileges.some(privilege => action.includes(privilege.module));
  } else {
    return user.role.privileges.some(privilege => privilege.module == action);
  }
};

export const currencyFormat = (number, currency= "USD") => {
  return number.toLocaleString('en-US', {style: 'currency', currency});
};

export const truncate = (string, limit) => {
  if (string.length <= limit){
    return string;
  }
  return string.slice(0, limit) + "...";
}

export default {
  storeLoginSession,
  validateEmail,
  clearSession,
  generateAuthToken,
  pagination,
  paging,
  groupBy,
  isValidCode,
  dateFormat,
  generatePassword,
  adminPagination,
  isPhoneValid,
  getCountryCode,
  formatPhoneNumber,
  displayPhoneNumber,
  isAuthorized,
  currencyFormat,
  truncate,
};
