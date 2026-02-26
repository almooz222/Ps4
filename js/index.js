// المراجع الأساسية
const ckbaj = document.getElementById('ckbaj');
const consoleDev = document.getElementById("console");
const plsbtn = document.querySelectorAll('.button-container button');

var ps4fw;

// تهيئة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadsettings();
});

// دالة تسجيل الرسائل في الكونسول الخاص بك
function log(msg) {
    if (consoleDev) {
        consoleDev.append(`[+] ${msg}\n`);
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

// دالة فحص النظام
function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        ps4fw = fwVersion;
        document.getElementById('PS4FW').textContent = `PS4 FW: ${fwVersion} | Compatible`;
        document.getElementById('PS4FW').style.color = 'green';
    }
}

// --- الوظيفة الأساسية للتهكير ---
async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        log("الجهاز مهكر بالفعل!");
        return;
    }

    document.getElementById('jailbreak').style.display = 'none';
    log("جاري تشغيل PSFree...");

    // تحديد مسار ملف الـ bin بناءً على اختيار المستخدم
    // ملاحظة: تأكد أن المسارات مطابقة لمجلداتك في GitHub
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin"; 
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    log(`المسار المختار: ${window.payload_path}`);

    try {
        // استيراد alert.mjs هو الذي يطلق الثغرة بالكامل
        // نستخدم d.getTime لمنع المتصفح من استخدام نسخة كاش قديمة أثناء التطوير
        await import(`../psfree/alert.mjs?${new Date().getTime()}`);
    } catch (e) {
        log("فشل تحميل الثغرة: " + e);
        document.getElementById('jailbreak').style.display = 'block';
    }
}

// دالة تحميل البيلودات الأخرى (مثل ميزان الحرارة أو اللينكس)
async function Loadpayloads(payloadName) {
    log(`جاري تحميل بيلود: ${payloadName}...`);
    window.payload_path = `payloads/${payloadName}.bin`;
    
    try {
        await import(`../psfree/alert.mjs?${new Date().getTime()}`);
    } catch (e) {
        log("خطأ في البيلود: " + e);
    }
}

// إعدادات الألوان والتبديل (كما في كودك الأصلي)
function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#00F0FF' : '#FFB84D';
    document.getElementById('header-title').style.textShadow = `0px 0px 15px ${themeColor}`;
    document.getElementById('console').style.borderColor = themeColor;
    plsbtn.forEach(btn => { btn.style.borderColor = themeColor; });
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
    if (localStorage.getItem('autojbstate') === 'true') ckbaj.checked = true;
    if (localStorage.getItem('HEN')) {
        const radio = document.querySelector('input[value="HEN"]');
        if(radio) radio.checked = true;
    }
    checksettings();
    
    if (ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
        setTimeout(jailbreak, 3000);
    }
}
