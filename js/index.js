// --- المراجع والعناصر ---
const ckbaj = document.getElementById('ckbaj');
const ckbdc = document.getElementById('ckbdc');
const consoleDev = document.getElementById("console");
const plsbtn = document.querySelectorAll('.button-container button');

// متغيرات الحالة
var ps4fw;
const savedaj = localStorage.getItem('autojbstate');
const savedc = localStorage.getItem('dbugc');
const visibleDiv = localStorage.getItem('visibleDiv') || 'jailbreak-page';

// --- وظائف التسجيل والتشخيص ---

function log(msg) {
    if (consoleDev) {
        consoleDev.append(`[+] ${msg}\n`);
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
    console.log(msg);
}

function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        ps4fw = fwVersion;
        document.getElementById('PS4FW').textContent = `PS4 FW: ${fwVersion} | Compatible`;
        document.getElementById('PS4FW').style.color = 'green';
    } else {
        document.getElementById('PS4FW').textContent = "PC Mode / Testing";
        document.getElementById('PS4FW').style.color = 'gray';
    }
}

// --- وظائف الثغرة (PSFree) ---

async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        log("الجهاز مهكر بالفعل في هذه الجلسة!");
        return;
    }

    // تعطيل الزر بصرياً لمنع النقرات المتعددة
    const jbBtn = document.getElementById('jailbreak');
    jbBtn.style.pointerEvents = 'none';
    jbBtn.style.opacity = '0.5';
    
    log("بدء عملية التهكير... يرجى الانتظار.");

    // تحديد مسار البيلود بناءً على اختيار HEN أو GoldHEN
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    log("تحميل البيلود: " + window.payload_path);

    try {
        // استدعاء ملف الثغرة الرئيسي مع كسر الكاش
        const modulePath = `../psfree/alert.mjs?v=${Date.now()}`;
        await import(modulePath);
        log("تم إطلاق الثغرة بنجاح.");
    } catch (e) {
        log("خطأ في تشغيل الثغرة: " + e);
        jbBtn.style.pointerEvents = 'all';
        jbBtn.style.opacity = '1';
    }
}

async function Loadpayloads(payloadName) {
    log("جاري تحضير البيلود الفرعي: " + payloadName);
    window.payload_path = `payloads/${payloadName}.bin`;
    
    try {
        const modulePath = `../psfree/alert.mjs?v=${Date.now()}`;
        await import(modulePath);
    } catch (e) {
        log("خطأ في تحميل البيلود: " + e);
    }
}

// --- إدارة الإعدادات والواجهة ---

function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#00F0FF' : '#FFB84D';

    document.getElementById('header-title').style.textShadow = `0px 0px 15px ${themeColor}`;
    const consoleBox = document.getElementById('console');
    if (consoleBox) consoleBox.style.borderColor = themeColor;
    
    plsbtn.forEach(btn => {
        btn.style.borderColor = themeColor;
    });

    const containers = document.querySelectorAll('.button-container');
    containers.forEach(c => c.style.borderColor = themeColor);
}

window.choosejb = function(type) {
    if (type === 'HEN') {
        localStorage.removeItem('GoldHEN');
        localStorage.setItem('HEN', '1');
    } else {
        localStorage.removeItem('HEN');
        localStorage.setItem('GoldHEN', '1');
    }
    checksettings();
};

function loadsettings() {
    CheckFW();
    
    if (savedaj === 'true') ckbaj.checked = true;
    if (savedc === 'true') {
        ckbdc.checked = true;
        const debugC = document.getElementById('DebugConsole');
        if (debugC) debugC.style.display = 'flex';
    }

    if (localStorage.getItem('HEN')) {
        const radio = document.querySelector('input[value="HEN"]');
        if(radio) radio.checked = true;
    }

    if (visibleDiv === 'payloads-page') {
        showpayloads();
    }

    checksettings();

    // Auto JB logic
    if (ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
        log("سيتم البدء تلقائياً خلال 3 ثوانٍ...");
        setTimeout(jailbreak, 3000);
    }
}

// --- مستمعي الأحداث (Event Listeners) ---

document.getElementById('jailbreak').addEventListener('click', jailbreak);

document.getElementById('payloadsbtn').addEventListener('click', showpayloads);

document.querySelectorAll('button[data-func]').forEach(button => {
    button.addEventListener('click', () => {
        Loadpayloads(button.getAttribute('data-func'));
    });
});

ckbaj.addEventListener('change', (e) => {
    localStorage.setItem('autojbstate', e.target.checked);
});

ckbdc.addEventListener('change', (e) => {
    localStorage.setItem('dbugc', e.target.checked);
    const debugC = document.getElementById('DebugConsole');
    if (debugC) debugC.style.display = e.target.checked ? 'flex' : 'none';
});

// --- وظائف النافذة العامة ---

function showpayloads() {
    const btn = document.getElementById('payloadsbtn');
    const jbPage = document.getElementById('jailbreak-page');
    const plPage = document.getElementById('payloads-page');

    if (jbPage.style.display !== 'none') {
        jbPage.style.display = 'none';
        plPage.style.display = 'block';
        btn.textContent = 'Jailbreak';
        localStorage.setItem('visibleDiv', 'payloads-page');
    } else {
        jbPage.style.display = 'block';
        plPage.style.display = 'none';
        btn.textContent = 'Payloads';
        localStorage.setItem('visibleDiv', 'jailbreak-page');
    }
}

// تهيئة عند التشغيل
window.addEventListener('DOMContentLoaded', loadsettings);

// تصدير الوظائف للـ HTML إذا لزم الأمر
window.showabout = () => { document.getElementById('about-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closeabout = () => { document.getElementById('about-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
window.showsettings = () => { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closesettings = () => { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
