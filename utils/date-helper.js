import dayjs from "dayjs";
import moment from "moment-jalaali";
moment.loadPersian({ dialect: "persian-modern" });

export const fromNow = (date) => {
  let d = moment(date);
  return d.fromNow();
};

export const getTimeOnly = (date) => {
  let inputDate = dayjs(date);
  return inputDate.format("HH:mm");
};

export const getPersianDate = (date) => {
  let time = dayjs(date);
  let m = moment(time.format("YYYY/MM/DD"), "YYYY/MM/DD");
  let dateString = m.format("jYYYY/jMM/jDD");
  return dateString;
};

export const getPersianDateWithMonthInLetters = (date) => {
  let time = dayjs(date);
  let td = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(time);
  return td;
};
export const isDiscountArrive = (discount) => {
  const startDate = dayjs(discount?.startDate);
  const now = dayjs();
  if (discount) return now.isAfter(startDate);
  return false;
};
export const addHoursToDate = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

export const calculateExpireTime = (date) => {
  const expireDate = dayjs(date).add(1, "h");
  return expireDate.diff(dayjs(), "m");
};

export const getPersianDateWithTime = (date) => {
  let time = dayjs(date);
  let m = moment(time.format("YYYY/MM/DD HH:mm"), "YYYY/MM/DD HH:mm");
  let dateString = m.format("jYYYY/jMM/jDD HH:mm");
  return dateString;
};

export const getDateOnly = (date) => {
  let time = dayjs(date);
  let dateString = time.format("YYYY/MM/DD");
  return dateString;
};

export const calculateWeek = () => {
  var days = [
    "یکشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنج شنبه",
    "جمعه",
    "شنبه",
  ];
  let weekArray = [];
  let lastWeekDay = dayjs().subtract(6, "d");
  let startIndex = lastWeekDay.day();

  for (let i = startIndex; i <= startIndex + 6; i++) {
    var dayName = days[dayjs().day(i).day()];
    weekArray.push(dayName);
  }
  return weekArray;
};

export const calculateMonth = () => {
  var month = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  let time = dayjs();
  let m = moment(time.format("YYYY/MM/DD"), "YYYY/MM/DD");
  let last6Month = m.subtract(5, "jMonth");
  let startIndex = last6Month.jMonth();

  let monthArray = [];

  for (let i = startIndex; i <= startIndex + 5; i++) {
    var monthName = month[moment().jMonth(i).jMonth()];
    monthArray.push(monthName);
  }
  return monthArray;
};

export const calculateYear = (startYear) => {
  let yearArray = [];

  let activityYears = dayjs().diff(dayjs(startYear), "year");

  if (activityYears < 1) {
    return ["" + dayjs().year()];
  } else {
    for (let i = 0; i < activityYears; i++) {
      var year = dayjs().subtract(i, "y");
      yearArray.push(year.year());
    }
    return yearArray.reverse();
  }
};
