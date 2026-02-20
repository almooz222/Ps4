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

// مستمعات الأحداث الأساسية
document.getElementById('jailbreak').addEventListener('click', jailbreak);
document.getElementById('binloader').addEventListener('click', binloader);
document.querySelectorAll('button[data-func]').forEach(btn => {
    btn.addEventListener('click', () => Loadpayloads(btn.getAttribute('data-func')));
});

// فحص الفيرموير
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

// إدارة الثيمات (ألوان المتجر)
function checksettings() {
    const isHen = localStorage.getItem('HEN');
    const color = isHen ? '#FFB84D' : '#00adef';
    document.getElementById('header-title').style.textShadow = `0 0 15px ${color}`;
    document.querySelectorAll('.menu-btn, .button-container button').forEach(btn => {
        btn.style.borderColor = color;
    });
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

function showpayloads() {
    const jbPage = document.getElementById('jailbreak-page');
    const plPage = document.getElementById('payloads-page');
    const btn = document.getElementById('payloadsbtn');

    if (plPage.style.display === 'none' || plPage.style.display === '') {
        jbPage.style.display = 'none';
        plPage.style.display = 'block';
        btn.textContent = 'الرئيسية';
    } else {
        jbPage.style.display = 'block';
        plPage.style.display = 'none';
        btn.textContent = 'البايلودات';
    }
}

function showSection(sec) {
    document.getElementById('tools-section').style.display = sec === 'tools' ? 'grid' : 'none';
    document.getElementById('games-section').style.display = sec === 'games' ? 'grid' : 'none';
}

// دوال الثغرة الأساسية
async function jailbreak() {
    if (sessionStorage.getItem('jbsuccess')) {
        alert("الجهاز مهكر بالفعل!");
        return;
    }
    log("جاري البدء... يرجى الانتظار.");
    try {
        const modules = await Promise.all([
            import('../payloads/Jailbreak.js'),
            import('../psfree/alert.mjs')
        ]);
        const JailbreakModule = modules[0];
        if (localStorage.getItem('HEN')) JailbreakModule.HEN();
        else JailbreakModule.GoldHEN();
    } catch (e) { log("خطأ في التحميل: " + e); }
}

async function Loadpayloads(payload) {
    log(`جاري تشغيل: ${payload}...`);
    try {
        const modules = await import('../payloads/payloads.js');
        if (modules[payload]) modules[payload]();
        else log("البايلود غير مدعوم.");
    } catch (e) { log("فشل التحميل: " + e); }
}

function log(msg) {
    consoleDev.textContent += msg + "\n";
    consoleDev.scrollTop = consoleDev.scrollHeight;
}

// دوال النوافذ
function showsettings() { document.getElementById('settings-popup').style.display = 'block'; document.getElementById('overlay-popup').style.display = 'block'; }
function showabout() { document.getElementById('about-popup').style.display = 'block'; document.getElementById('overlay-popup').style.display = 'block'; }
function closeAll() { document.querySelectorAll('.popup, .overlay').forEach(el => el.style.display = 'none'); }
function loadjbflavor() {
    const saved = localStorage.getItem('selectedHEN');
    if (saved) document.querySelector(`input[value="${saved}"]`).checked = true;
}
function loadajbsettings() {
    ckbaj.checked = localStorage.getItem('autojbstate') === 'true';
    ckbdc.checked = localStorage.getItem('dbugc') === 'true';
    if (ckbdc.checked) document.getElementById('DebugConsole').style.display = 'block';
} 
