// --- تعريف الدوال الأساسية وربطها بـ window لضمان عمل الأزرار ---

// دالة الطباعة في الكونسول الخاص بك
window.log = function(msg) {
    const consoleDev = document.getElementById("console");
    if (consoleDev) {
        consoleDev.append("[+] " + msg + "\n");
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
};

// دالة فحص الإصدار
window.CheckFW = function() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
    const fwElem = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        if (fwElem) {
            fwElem.textContent = "PS4 FW: " + fwVersion + " | Compatible";
            fwElem.style.color = 'green';
        }
        document.title = "PSFree | " + fwVersion;
        return fwVersion;
    } else {
        if (fwElem) {
            fwElem.textContent = "PC Mode / Testing";
            fwElem.style.color = 'gray';
        }
        return "9.00"; // افتراضي للتجربة
    }
};

// --- وظيفة التهكير الرئيسية ---
window.jailbreak = async function() {
    if (sessionStorage.getItem('jbsuccess')) {
        window.log("الجهاز مهكر بالفعل!");
        return;
    }

    const jbBtn = document.getElementById('jailbreak');
    if (jbBtn) {
        jbBtn.style.pointerEvents = 'none';
        jbBtn.style.opacity = '0.5';
    }

    window.log("بدء تشغيل PSFree...");

    // تحديد المسار
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    window.log("البيلود: " + window.payload_path);

    try {
        // استدعاء الثغرة (المسار الصحيح بالنسبة لمجلد js هو ../psfree/)
        await import('../psfree/alert.mjs?v=' + Date.now());
    } catch (e) {
        window.log("خطأ: " + e);
        if (jbBtn) {
            jbBtn.style.pointerEvents = 'all';
            jbBtn.style.opacity = '1';
        }
    }
};

// تحميل البيلودات الفرعية
window.Loadpayloads = async function(payloadName) {
    window.log("تشغيل بيلود: " + payloadName);
    window.payload_path = "payloads/" + payloadName + ".bin";
    try {
        await import('../psfree/alert.mjs?v=' + Date.now());
    } catch (e) {
        window.log("فشل: " + e);
    }
};

// --- إدارة الواجهة والألوان ---
window.checksettings = function() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#00F0FF' : '#FFB84D';
    
    const header = document.getElementById('header-title');
    if (header) header.style.textShadow = "0px 0px 15px " + themeColor;
    
    const consoleBox = document.getElementById('console');
    if (consoleBox) consoleBox.style.borderColor = themeColor;
    
    document.querySelectorAll('.button-container, .ps-btn, .menu-btn').forEach(el => {
        el.style.borderColor = themeColor;
    });
};

window.choosejb = function(type) {
    if (type === 'HEN') {
        localStorage.removeItem('GoldHEN');
        localStorage.setItem('HEN', '1');
    } else {
        localStorage.removeItem('HEN');
        localStorage.setItem('GoldHEN', '1');
    }
    window.checksettings();
};

window.showpayloads = function() {
    const btn = document.getElementById('payloadsbtn');
    const jbPage = document.getElementById('jailbreak-page');
    const plPage = document.getElementById('payloads-page');

    if (jbPage && jbPage.style.display !== 'none') {
        jbPage.style.display = 'none';
        plPage.style.display = 'block';
        if (btn) btn.textContent = 'Jailbreak';
        localStorage.setItem('visibleDiv', 'payloads-page');
    } else {
        if (jbPage) jbPage.style.display = 'block';
        if (plPage) plPage.style.display = 'none';
        if (btn) btn.textContent = 'Payloads';
        localStorage.setItem('visibleDiv', 'jailbreak-page');
    }
};

// --- النوافذ المنبثقة ---
window.showabout = () => { document.getElementById('about-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closeabout = () => { document.getElementById('about-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
window.showsettings = () => { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closesettings = () => { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };

// --- التشغيل عند تحميل الصفحة ---
window.addEventListener('DOMContentLoaded', () => {
    window.CheckFW();
    
    // استرجاع الإعدادات
    if (localStorage.getItem('autojbstate') === 'true') {
        document.getElementById('ckbaj').checked = true;
    }
    
    if (localStorage.getItem('dbugc') === 'true') {
        document.getElementById('ckbdc').checked = true;
        document.getElementById('DebugConsole').style.display = 'flex';
    }

    if (localStorage.getItem('visibleDiv') === 'payloads-page') {
        window.showpayloads();
    }

    window.checksettings();

    // تشغيل تلقائي
    if (document.getElementById('ckbaj').checked && !sessionStorage.getItem('jbsuccess')) {
        window.log("تشغيل تلقائي بعد 3 ثوانٍ...");
        setTimeout(window.jailbreak, 3000);
    }
});

// ربط الأحداث للعناصر التي قد لا تملك onclick في الـ HTML
document.getElementById('jailbreak')?.addEventListener('click', window.jailbreak);
document.getElementById('payloadsbtn')?.addEventListener('click', window.showpayloads);
document.getElementById('ckbaj')?.addEventListener('change', (e) => localStorage.setItem('autojbstate', e.target.checked));
document.getElementById('ckbdc')?.addEventListener('change', (e) => {
    localStorage.setItem('dbugc', e.target.checked);
    document.getElementById('DebugConsole').style.display = e.target.checked ? 'flex' : 'none';
});
