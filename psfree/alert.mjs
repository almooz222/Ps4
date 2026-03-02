/* Copyright (C) 2023-2025 anonymous

This file is part of PSFree.

PSFree is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

PSFree is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

// We can't just open a console on the ps4 browser, make sure the errors thrown
// by our program are alerted.

addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  alert(`Unhandled rejection\n${reason}\n${reason.sourceURL}:${reason.line}:${reason.column}\n${reason.stack}`);
});

addEventListener("error", (event) => {
  const reason = event.error;
  alert(`Unhandled error\n${reason}\n${reason.sourceURL}:${reason.line}:${reason.column}\n${reason.stack}`);
  return true;
});

// الحل: الاستيراد الديناميكي بمسار مناسب مع التعامل مع حالات الفشل
(async () => {
  try {
    // تأكد من الامتداد الصحيح، حيث بعض متصفحات PS4 لا تدعم mjs، جرب js إذا ظهرت مشاكل
    await import("./psfree.mjs"); // لو لم يعمل، جرب بدل الامتداد js في جميع الملفات والمنافست أيضا
  } catch(e) {
    alert("فشل تحميل psfree الموديول: " + e.message);
  }
})();
