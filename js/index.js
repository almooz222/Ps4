// Baleegh Store - Optimized For Offline Use
const ckbaj = document.getElementById('ckbaj');
const consoleDev = document.getElementById("console");
const menuBtns = document.querySelectorAll('.menu-btn');
const psBtns = document.querySelectorAll('.ps-btn');
const plsbtn = document.querySelectorAll('.button-container button');

var ps4fw;

// تهيئة الصفحة
window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadsettings();
});

// زر التهكير الأساسي
document.getElementById('jailbreak').addEventListener('click', jailbreak);

// وظيفة فحص إصدار النظام (من كودك الأصلي مع تحسين)
function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
    const fwEl = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const match = userAgent.match(ps4Regex);
        const fwVersion = match ? match[1] : "Unknown";
        ps4fw = fwVersion;
        fwEl.textContent = `PS4 FW: ${fwVersion} | Compatible`;
        fwEl.style.color = '#00adef';
        document.title = "PSFree | " + fwVersion;
    } else {
        ps4fw = "9.00"; // افتراضي للتجربة
        fwEl.textContent = "PC Mode - Testing Only";
        fwEl.style.color = 'gray';
    }
}

// وظيفة تشغيل الثغرة (تم تعديلها لتعمل أوفلاين 100%)
async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        log("الجهاز مهكر بالفعل!");
        return;
    }

    document.getElementById('jailbreak').style.display = 'none';
    log("جاري تحضير الثغرة... يرجى الانتظار");

    // تحديد مسار البيلود (GoldHEN أو HEN) ليقرأه ملف lapse.mjs لاحقاً
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    try {
        // نستخدم المسار المباشر من المجلد الرئيسي لضمان عدم فشل الكاش
        // ملاحظة: إذا كان ملف index.js داخل مجلد js، نستخدم ../ للوصول لـ psfree
        await import('../psfree/alert.mjs');
        log("تم تحميل الموديلات. بدأت العملية...");
    } catch (e) {
        console.error(e);
        log("فشل السكربت: تأكد من اكتمال الكاش 100% (Offline Error)");
        document.getElementById('jailbreak').style.display = 'flex';
        alert("فشل استيراد المودل. يرجى إعادة تفعيل الكاش أونلاين مرة واحدة.");
    }
}

// وظائف التنسيق والألوان بناءً على الاختيار
function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#FFB84D' : '#00adef';
    
    document.getElementById('header-title').style.textShadow = `0px 0px 15px ${themeColor}`;
    document.getElementById('console').style.borderColor = themeColor;
    
    plsbtn.forEach(btn => {
        btn.style.borderColor = themeColor;
    });
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

// تحميل الإعدادات المحفوظة
function loadsettings() {
    if (localStorage.getItem('HEN')) {
        const henRadio = document.querySelector('input[value="HEN"]');
        if (henRadio) henRadio.checked = true;
    } else {
        const goldRadio = document.querySelector('input[value="GoldHEN"]');
        if (goldRadio) goldRadio.checked = true;
    }
    
    // تفعيل الأوتو جيلبريك إذا كان مختاراً
    if (localStorage.getItem('autojbstate') === 'true' && !sessionStorage.getItem('jbsuccess')) {
        log("تشغيل تلقائي...");
        setTimeout(jailbreak, 3000);
    }
    
    checksettings();
}

function log(msg) {
    if (consoleDev) {
        consoleDev.textContent += "[+] " + msg + "\n";
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

// وظائف القوائم (مبسطة)
function showsettings() { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; }
function closesettings() { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; }
