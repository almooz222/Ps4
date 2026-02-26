// Baleegh Store 2 - Pro Edition (Final Stable Build)
var ps4fw;
const consoleDev = document.getElementById("console");

// تهيئة الصفحة عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadSettings();
    checkVisualTheme();
});

// ربط زر التهكير
document.getElementById('jailbreak').addEventListener('click', jailbreak);

// وظيفة فحص إصدار النظام
function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation 4\/(\d+\.\d+)/;
    const fwEl = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        ps4fw = fwVersion;
        fwEl.textContent = "PS4 FW: " + fwVersion + " | Compatible";
        fwEl.style.color = '#00adef';
    } else {
        ps4fw = "9.00"; // قيمة افتراضية للتجربة على المتصفحات العادية
        fwEl.textContent = "PC Mode / Testing on 9.00";
        fwEl.style.color = 'gray';
    }
}

// تغيير الألوان بناءً على نوع التهكير (HEN أو GoldHEN)
function checkVisualTheme() {
    const isHen = localStorage.getItem('HEN');
    const color = isHen ? '#FFB84D' : '#00adef';
    const title = document.getElementById('header-title');
    if(title) title.style.textShadow = "0 0 15px " + color;
    
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.style.borderColor = color;
    });
    
    const psBtn = document.querySelector('.ps-btn');
    if(psBtn) psBtn.style.borderColor = color;
}

// اختيار نوع التهكير من الإعدادات
function choosejb(hen) {
    if (hen === 'HEN') {
        localStorage.removeItem('GoldHEN');
        localStorage.setItem('HEN', '1');
    } else {
        localStorage.removeItem('HEN');
        localStorage.setItem('GoldHEN', '1');
    }
    checkVisualTheme();
}

// الوظيفة الأساسية لتشغيل الثغرة
async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        alert("الجهاز مهكر بالفعل! أعد تشغيل الجهاز إذا كنت تريد التهكير مجدداً.");
        return;
    }
    
    // تغيير الواجهة لبدء التحميل
    document.getElementById('jailbreak').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    
    log("جاري تحضير ثغرة PSFree...");

    // تحديد مسار البيلود الذي سيقرأه ملف lapse.mjs لاحقاً
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    try {
        // استدعاء ملف alert.mjs
        // بما أن index.js داخل مجلد js، نستخدم ../ للعودة للمجلد الرئيسي
        await import('../psfree/alert.mjs');
        log("تم استيراد الموديلات بنجاح. انتظر الثغرة...");
    } catch (e) { 
        log("خطأ في الاستيراد: " + e);
        document.getElementById('jailbreak').style.display = 'flex';
        document.getElementById('loader').style.display = 'none';
        alert("فشل تحميل ملفات الثغرة. تأكد من اكتمال الكاش 100% وحاول مجدداً.");
    }
}

// وظيفة الكتابة في كونسول الصفحة
function log(msg) {
    if(consoleDev) {
        consoleDev.textContent += "[+] " + msg + "\n";
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

// وظائف التحكم في النوافذ المنبثقة
function showsettings() { 
    document.getElementById('settings-popup').style.display = 'block'; 
    document.getElementById('overlay-popup').style.display = 'block'; 
}
function closesettings() { 
    document.getElementById('settings-popup').style.display = 'none'; 
    document.getElementById('overlay-popup').style.display = 'none'; 
}
function showabout() { 
    document.getElementById('about-popup').style.display = 'block'; 
    document.getElementById('overlay-popup').style.display = 'block'; 
}
function closeabout() { 
    document.getElementById('about-popup').style.display = 'none'; 
    document.getElementById('overlay-popup').style.display = 'none'; 
}

// تحميل الإعدادات المحفوظة
function loadSettings() {
    if (localStorage.getItem('HEN')) {
        const henRadio = document.querySelector('input[value="HEN"]');
        if(henRadio) henRadio.checked = true;
    } else {
        const goldRadio = document.querySelector('input[value="GoldHEN"]');
        if(goldRadio) goldRadio.checked = true;
        localStorage.setItem('GoldHEN', '1');
    }
    
    if (localStorage.getItem('ckbaj') == 'true') {
        const ckbaj = document.getElementById('ckbaj');
        if(ckbaj) ckbaj.checked = true;
    }
}
