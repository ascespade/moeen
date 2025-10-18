#!/usr/bin/env node

/**
 * سكريبت لجلب التاريخ والوقت الحالي
 */

let now = new Date();
let isoString = now.toISOString();
let dateOnly = isoString.split('T')[0];
let timeOnly = isoString.split('T')[1].split('.')[0];

// console.log(JSON.stringify({
  iso: isoString,
  date: dateOnly,
  time: timeOnly,
  timestamp: now.getTime(),
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
  hour: now.getHours(),
  minute: now.getMinutes(),
  second: now.getSeconds()
}, null, 2));
