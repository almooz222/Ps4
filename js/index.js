// Baleegh Store 2 - Core Logic Pro Fix
var ps4fw;
const consoleDev = document.getElementById("console");

window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadSettings();
    checkVisualTheme();
});

// ربط الزر
document.getElementById('jailbreak').addEventListener('click', jailbreak);

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
        ps4fw = "9.00"; // افتراضي للحاسوب
        fwEl.textContent = "PC Mode / Testing on 9.00";
        fwEl.style.color = 'gray';
    }
}

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

async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        alert("الجهاز مهكر بالفعل!");
        return;
    }
    
    // إخفاء الزر وإظهار اللودر
    document.getElementById('jailbreak').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    
    log("جاري تحضير ثغرة PSFree...");

    // تحديد مسار البيلود الذي سيتم تشغيله بعد الثغرة
    if (localStorage.getItem('HEN')) {
        window.payload_path = "./payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "./payloads/GoldHEN/GoldHEN.bin";
    }

    try {
        // استدعاء ملف alert.mjs وهو بدوره سيقوم بعمل import لـ psfree.mjs
        // هذا هو المسار الصحيح للملفات التي أرسلتها لي
        await import('../psfree/alert.mjs');
        log("تم تحميل موديلات الثغرة بنجاح.");
    } catch (e) { 
        log("خطأ في التحميل: " + e);
        document.getElementById('jailbreak').style.display = 'flex';
        document.getElementById('loader').style.display = 'none';
        alert("تأكد من وجود مجلد psfree والملفات بداخله.");
    }
}

function log(msg) {
    if(consoleDev) {
        consoleDev.textContent += "[+] " + msg + "\n";
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

// الوظائف المساعدة للنافذة المنبثقة
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

function loadSettings() {
    // تحميل اختيار HEN أو GoldHEN
    if (localStorage.getItem('HEN')) {
        document.querySelector('input[value="HEN"]').checked = true;
    } else {
        document.querySelector('input[value="GoldHEN"]').checked = true;
        localStorage.setItem('GoldHEN', '1');
    }
    
    // تحميل إعدادات الكونسول والتلقائي
    if (localStorage.getItem('ckbaj') == 'true') document.getElementById('ckbaj').checked = true;
}

// حفظ الإعدادات عند التغيير
function savejbflavor() {
    // تُستدعى من الـ HTML
}
