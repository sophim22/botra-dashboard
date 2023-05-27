import {formatCurrency, dateFormat, unixToDate} from "../app/helper/utils";
const activeClass = (route, path, absolute = false) => {
  if (!absolute) {
    path = path.split("/")[path.split("/").length - 1] || "dashboard";
  } else {
    return path.includes(route) ? "active" : "";
  }
  return route === path ? "active" : "";
};

const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export default async (req, res, next) => {
  const isIE = req.useragent.isIE;
  const isLocale = !!req.query.locale;
  const basePath = req.path;
  // console.log({ res })
  // let locale = req.query.locale || i18n.locale;
  // if (!i18n.validLocale.includes(locale)) {
  //   locale = i18n.defaultLocale;
  // }
  // if (!isLocale || locale !== i18n.locale) {
  //   i18n.locale = locale;
  // }
  // req.query.locale = 'ja';
  if (!res.locals.isSignIn) res.locals.isSignIn = false;
  res.locals.hideSideMenu = false;
  if (req.csrfToken) res.locals.csrfToken = req.csrfToken();
  res.locals.routeName = basePath || "dashboard";
  res.locals.activeClass = activeClass;
  res.locals.formatNumber = formatNumber;
  res.locals.dateFormat = dateFormat;
  res.locals.unixToDate = unixToDate;
  res.locals.isIE = isIE || false;
  res.locals.formatCurrency = formatCurrency;
  next();
};
