const ckbaj = document.getElementById('ckbaj');
const ckbdc = document.getElementById('ckbdc');
const consoleDev = document.getElementById("console");
var ps4fw;

window.addEventListener('DOMContentLoaded', () => {
    CheckFW();
    loadajbsettings();
    loadjbflavor();
    checksettings();
});

// ربط زر البلايستيشن بوظيفة الجيلبريك
document.getElementById('jailbreak').addEventListener('click', jailbreak);

function CheckFW() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation 4\/(\d+\.\d+)/;
    const fwEl = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        ps4fw = fwVersion.replace('.', '');
        fwEl.textContent = `PS4 FW: ${fwVersion} | Compatible`;
        fwEl.style.color = '#00adef';
    } else {
        fwEl.textContent = "PC Mode / Unsupported";
        fwEl.style.color = 'gray';
    }
}

function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const color = isHen ? '#FFB84D' : '#00adef';
    const title = document.getElementById('header-title');
    if(title) title.style.textShadow = `0 0 15px ${color}`;
    
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
    checksettings();
}

async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        alert("الجهاز مهكر بالفعل!");
        return;
    }
    
    log("جاري البدء... يرجى الانتظار.");
    
    try {
        // 1. استدعاء ملف تحديد المسارات أولاً (تم إصلاح المسار ليكون ./)
        const JailbreakModule = await import('./payloads/Jailbreak.js');
        
        // 2. تحديد نوع التهكير بناءً على اختيارك
        if (localStorage.getItem('HEN')) {
            JailbreakModule.HEN();
        } else {
            JailbreakModule.GoldHEN();
        }
        
        // 3. تشغيل الثغرة الفعلية بعد تحديد المسار
        await import('./psfree/alert.mjs');
        
    } catch (e) { 
        log("خطأ في التحميل: " + e);
        alert("حدث خطأ! تأكد من وجود ملفات الجيلبريك في مساراتها الصحيحة.");
    }
}

function log(msg) {
    if(consoleDev) {
        consoleDev.textContent += msg + "\n";
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
}

function showsettings() { 
    document.getElementById('settings-popup').style.display = 'block'; 
    document.getElementById('overlay-popup').style.display = 'block'; 
}

function showabout() { 
    document.getElementById('about-popup').style.display = 'block'; 
    document.getElementById('overlay-popup').style.display = 'block'; 
}

function closeAll() { 
    document.querySelectorAll('.popup, .overlay').forEach(el => el.style.display = 'none'); 
}

function loadjbflavor() {
    const savedHen = localStorage.getItem('HEN');
    const savedGold = localStorage.getItem('GoldHEN');
    
    if (savedHen) {
        const el = document.querySelector('input[value="HEN"]');
        if(el) el.checked = true;
    } else if (savedGold) {
        const el = document.querySelector('input[value="GoldHEN"]');
        if(el) el.checked = true;
    } else {
        // تعيين GoldHEN كافتراضي إذا لم يختر المستخدم شيئاً
        const el = document.querySelector('input[value="GoldHEN"]');
        if(el) el.checked = true;
        localStorage.setItem('GoldHEN', '1');
    }
}

function loadajbsettings() {
    if
