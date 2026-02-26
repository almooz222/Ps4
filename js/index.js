// المراجع من كودك الأصلي
const ckbaj = document.getElementById('ckbaj');
const ckbdc = document.getElementById('ckbdc');
const visibleDiv = localStorage.getItem('visibleDiv') || 'jailbreak-page';
const savedaj = localStorage.getItem('autojbstate');
const savedc = localStorage.getItem('dbugc');
const menuBtns = document.querySelectorAll('.menu-btn');
const psBtns = document.querySelectorAll('.ps-btn');
const plsbtn = document.querySelectorAll('.button-container button');
const consoleDev = document.getElementById("console");

var ps4fw;

// تهيئة الصفحة عند التحميل
window.addEventListener('DOMContentLoaded', loadsettings);

// ربط الأزرار
document.getElementById('jailbreak').addEventListener('click', () => {
  jailbreak();
});

document.getElementById('binloader').addEventListener('click', () => {
  binloader();
});

// تشغيل البيلودات الفرعية
document.querySelectorAll('button[data-func]').forEach(button => {
  button.addEventListener('click', () => {
    const payload = button.getAttribute('data-func');
    Loadpayloads(payload);
  });
});

// إعدادات الـ Checkboxes
ckbaj.addEventListener('change', (e) => {
  localStorage.setItem('autojbstate', e.target.checked);
});

ckbdc.addEventListener('change', (e) => {
  localStorage.setItem('dbugc', e.target.checked);
  document.getElementById('DebugConsole').style.display = e.target.checked ? 'flex' : 'none';
});

// --- وظائف التشغيل الأساسية (تم تحديثها لتعمل مع PSFree) ---

async function jailbreak() {
  if (sessionStorage.getItem('jbsuccess')) {
    log("الجهاز مهكر بالفعل!");
    return;
  }

  document.getElementById('jailbreak').style.display = 'none';
  log("بدء عملية التهكير... يرجى الانتظار.");

  // تحديد المسار بناءً على اختيار المستخدم (HEN أو GoldHEN)
  if (localStorage.getItem('HEN')) {
    window.payload_path = "payloads/HEN/HEN.bin";
  } else {
    window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
  }

  try {
    // استدعاء ملف الثغرة الرئيسي (بدلاً من Jailbreak.js القديم)
    await import('../psfree/alert.mjs');
    log("تم تحميل ملفات الثغرة بنجاح.");
  } catch (e) {
    log("خطأ في تحميل الموديلات: " + e);
    document.getElementById('jailbreak').style.display = 'flex';
  }
}

async function binloader() {
  log("جاري تشغيل BinLoader...");
  sessionStorage.setItem('binloader', '1');
  try {
    await import('../psfree/alert.mjs');
  } catch (e) {
    log("خطأ: " + e);
  }
}

async function Loadpayloads(payloadName) {
  log("جاري تحضير البيلود: " + payloadName);
  // هنا نقوم بتوجيه الثغرة لتحميل بيلود معين من مجلد الـ payloads
  window.payload_path = `payloads/${payloadName}.bin`;
  try {
    await import('../psfree/alert.mjs');
  } catch (e) {
    log("خطأ: " + e);
  }
}

// --- وظائف الواجهة (من كودك الأصلي) ---

function CheckFW() {
  const userAgent = navigator.userAgent;
  const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
  
  if (ps4Regex.test(userAgent)) {
    const fwVersion = userAgent.match(ps4Regex)[1];
    ps4fw = fwVersion.replace('.', '');
    document.getElementById('PS4FW').textContent = `PS4 FW: ${fwVersion} | Compatible`;
    document.getElementById('PS4FW').style.color = 'green';
    document.title = "PSFree | " + fwVersion;
  } else {
    document.getElementById('PS4FW').textContent = "PC Mode / Testing";
    document.getElementById('PS4FW').style.color = 'gray';
  }
}

function checksettings() {
  const isHen = localStorage.getItem('HEN');
  const themeColor = isHen ? '#00F0FF' : '#FFB84D';

  document.getElementById('header-title').style.textShadow = `0px 0px 15px ${themeColor}`;
  document.getElementById('console').style.borderColor = themeColor;
  
  plsbtn.forEach(btn => {
    btn.style.borderColor = themeColor;
    btn.onmouseenter = () => btn.style.backgroundColor = themeColor;
    btn.onmouseleave = () => btn.style.backgroundColor = '';
  });

  const containers = document.querySelectorAll('.button-container');
  containers.forEach(c => c.style.borderColor = themeColor);
}

function choosejb(type) {
  if (type === 'HEN') {
    localStorage.removeItem('GoldHEN');
    localStorage.setItem('HEN', '1');
  } else {
    localStorage.removeItem('HEN');
    localStorage.setItem('GoldHEN', '1');
  }
  checksettings();
}

function loadsettings() {
  CheckFW();
  
  // استرجاع الإعدادات المحفوظة
  if (savedaj === 'true') ckbaj.checked = true;
  if (savedc === 'true') {
    ckbdc.checked = true;
    document.getElementById('DebugConsole').style.display = 'flex';
  }

  if (localStorage.getItem('HEN')) {
    const radio = document.querySelector('input[value="HEN"]');
    if(radio) radio.checked = true;
  }

  // التحكم في الصفحة الظاهرة
  if (visibleDiv === 'payloads-page') {
    showpayloads();
  }

  // تشغيل تلقائي إذا كان مفعل
  if (ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
    log("Auto jailbreaking in 3 seconds...");
    setTimeout(jailbreak, 3000);
  }

  checksettings();
}

// وظائف التنقل بين الصفحات
function showpayloads() {
  const btn = document.getElementById('payloadsbtn');
  if (btn.textContent === 'Payloads') {
    document.getElementById('jailbreak-page').style.display = 'none';
    document.getElementById('payloads-page').style.display = 'block';
    btn.textContent = 'Jailbreak';
    localStorage.setItem('visibleDiv', 'payloads-page');
  } else {
    document.getElementById('jailbreak-page').style.display = 'block';
    document.getElementById('payloads-page').style.display = 'none';
    btn.textContent = 'Payloads';
    localStorage.setItem('visibleDiv', 'jailbreak-page');
  }
}

function log(msg) {
  if (consoleDev) {
    consoleDev.append(`[+] ${msg}\n`);
    consoleDev.scrollTop = consoleDev.scrollHeight;
  }
}

// وظائف الـ Popups
function showabout() { document.getElementById('about-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; }
function closeabout() { document.getElementById('about-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; }
function showsettings() { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; }
function closesettings() { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; }
