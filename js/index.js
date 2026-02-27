/* PS4 Jailbreak Index JS
    تم إصلاح مشاكل الـ Module وربط الدوال بـ Window لضمان استجابة الأزرار
*/

// --- تعريف الوظائف وربطها بالنافذة (Global Scope) ---

window.log = function(msg) {
    const consoleDev = document.getElementById("console");
    if (consoleDev) {
        consoleDev.append("[+] " + msg + "\n");
        consoleDev.scrollTop = consoleDev.scrollHeight;
    }
};

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
        return fwVersion;
    } else {
        if (fwElem) fwElem.textContent = "PC Mode / Testing";
        return "9.00"; 
    }
};

window.jailbreak = async function() {
    if (sessionStorage.getItem('jbsuccess')) {
        window.log("الجهاز مهكر بالفعل!");
        return;
    }

    const jbBtn = document.getElementById('jailbreak');
    if (jbBtn) {
        jbBtn.disabled = true;
        jbBtn.style.opacity = '0.5';
    }

    window.log("جاري استدعاء ثغرة PSFree...");

    // اختيار البيلود
    if (localStorage.getItem('HEN')) {
        window.payload_path = "payloads/HEN/HEN.bin";
    } else {
        window.payload_path = "payloads/GoldHEN/GoldHEN.bin";
    }

    try {
        // نخرج من مجلد js ونذهب إلى psfree
        await import('../psfree/alert.mjs?v=' + Date.now());
        window.log("تم تحميل الملفات بنجاح.");
    } catch (e) {
        window.log("فشل التحميل: " + e);
        if (jbBtn) {
            jbBtn.disabled = false;
            jbBtn.style.opacity = '1';
        }
    }
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

window.checksettings = function() {
    const isHen = localStorage.getItem('HEN');
    const themeColor = isHen ? '#00F0FF' : '#FFB84D';
    
    const header = document.getElementById('header-title');
    if (header) header.style.textShadow = "0px 0px 15px " + themeColor;
    
    document.querySelectorAll('.button-container, .ps-btn, .menu-btn').forEach(el => {
        el.style.borderColor = themeColor;
    });
};

// --- تعريف وظائف الأزرار المنبثقة ---
window.showabout = () => { document.getElementById('about-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closeabout = () => { document.getElementById('about-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };
window.showsettings = () => { document.getElementById('settings-popup').style.display = 'flex'; document.getElementById('overlay-popup').style.display = 'block'; };
window.closesettings = () => { document.getElementById('settings-popup').style.display = 'none'; document.getElementById('overlay-popup').style.display = 'none'; };

// --- التشغيل التلقائي عند التحميل ---
window.addEventListener('load', () => {
    window.CheckFW();
    
    // استعادة حالة الأزرار
    const ckbaj = document.getElementById('ckbaj');
    const ckbdc = document.getElementById('ckbdc');
    
    if (ckbaj && localStorage.getItem('autojbstate') === 'true') ckbaj.checked = true;
    if (ckbdc && localStorage.getItem('dbugc') === 'true') {
        ckbdc.checked = true;
        document.getElementById('DebugConsole').style.display = 'flex';
    }

    if (localStorage.getItem('visibleDiv') === 'payloads-page') {
        window.showpayloads();
    }

    window.checksettings();

    // السكربت التلقائي
    if (ckbaj && ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
        window.log("سيتم البدء تلقائياً...");
        setTimeout(window.jailbreak, 3000);
    }
});
