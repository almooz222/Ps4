// كود بليغ ستور - النسخة النهائية المستقرة
const ckbaj = document.getElementById('ckbaj');
const ckbdc = document.getElementById('ckbdc');
const consoleDev = document.getElementById("console");
const plsbtn = document.querySelectorAll('.button-container button');
var ps4fw;

// تهيئة الصفحة
window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadsettings();
});

// ربط زر التهكير برمجياً بقوة (هذا سيحل مشكلة "الزر لا يستجيب")
const jbBtn = document.getElementById('jailbreak');
if (jbBtn) {
    jbBtn.addEventListener('click', jailbreak);
}

// دالة الطباعة
function log(msg) {
    if (consoleDev) {
        consoleDev.append("[+] " + msg + "\n");
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

// فحص النظام
function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
    const fwElem = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        ps4fw = fwVersion;
        if (fwElem) {
            fwElem.textContent = "PS4 FW: " + fwVersion + " | Compatible";
            fwElem.style.color = 'green';
        }
    } else {
        if (fwElem) fwElem.textContent = "PC Mode / Testing";
    }
}

// --- الوظيفة الأساسية للتهكير ---
async function jailbreak() {
    try {
        if (sessionStorage.getItem('jbsuccess')) {
            alert("الجهاز مهكر بالفعل!");
            return;
        }

        if (jbBtn) jbBtn.style.display = 'none';
        log("جاري إطلاق الثغرة...");

        // مسارات البيلودات
        if (localStorage.getItem('HEN')) {
            window.payload_path = "payloads/HEN/HEN.bin";
        } else {
            window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
        }

        log("تحميل: " + window.payload_path);

        // الاستدعاء الديناميكي الصحيح:
        // بما أن index.html في الجذر، فالمسار يجب أن يبدأ بـ ./
        await import('./psfree/alert.mjs');
        log("تم التحميل بنجاح.");
        
    } catch (e) {
        // في حال حدوث أي خطأ، ستظهر لك رسالة تنبيه بدلاً من "الصمت"
        alert("حدث خطأ أثناء التشغيل:\n" + e.message);
        log("خطأ: " + e.message);
        if (jbBtn) jbBtn.style.display = 'block';
    }
}

// --- بقية وظائف الواجهة والأزرار ---
function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#00F0FF' : '#FFB84D';
    
    const header = document.getElementById('header-title');
    if (header) header.style.textShadow = "0px 0px 15px " + themeColor;
    
    if (consoleDev) consoleDev.style.borderColor = themeColor;
    
    document.querySelectorAll('.button-container, .ps-btn, .menu-btn').forEach(el => {
        el.style.borderColor = themeColor;
    });
}

// دالة اختيار الجيلبريك، نجعلها Global لكي يراها الـ HTML
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
    if (localStorage.getItem('autojbstate') === 'true' && ckbaj) {
        ckbaj.checked = true;
    }
    if (localStorage.getItem('dbugc') === 'true' && ckbdc) {
        ckbdc.checked = true;
        document.getElementById('DebugConsole').style.display = 'flex';
    }
    if (localStorage.getItem('HEN')) {
        const radio = document.querySelector('input[value="HEN"]');
        if (radio) radio.checked = true;
    }

    checksettings();

    // الجيلبريك التلقائي
    if (ckbaj && ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
        log("التشغيل التلقائي بعد 3 ثوانٍ...");
        setTimeout(jailbreak, 3000);
    }
}

// ربط النوافذ المنبثقة
window.showabout = () => { document.getElementById('about-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closeabout = () => { document.getElementById('about-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
window.showsettings = () => { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closesettings = () => { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
