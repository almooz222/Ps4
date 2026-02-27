// --- وظائف عامة مرتبطة بالنافذة ---

window.log = function(msg) {
    const consoleElem = document.getElementById('console');
    if (consoleElem) {
        consoleElem.textContent += "[+] " + msg + "\n";
    }
    console.log(msg);
};

window.CheckFW = function() {
    const userAgent = navigator.userAgent;
    const ps4Regex = /PlayStation 4 (\d+\.\d+)/;
    const fwElem = document.getElementById('PS4FW');
    
    if (ps4Regex.test(userAgent)) {
        const fwVersion = userAgent.match(ps4Regex)[1];
        if (fwElem) fwElem.textContent = "PS4 FW: " + fwVersion + " | Compatible";
        return fwVersion;
    } else {
        if (fwElem) fwElem.textContent = "PC Mode / Testing";
        return "9.00";
    }
};

window.jailbreak = async function() {
    if (sessionStorage.getItem('jbsuccess')) {
        alert("الجهاز مهكر بالفعل!");
        return;
    }

    const loader = document.getElementById('loader');
    const jbBtn = document.getElementById('jailbreak');

    if (loader) loader.style.display = 'block';
    if (jbBtn) jbBtn.style.display = 'none';

    window.log("بدء تشغيل ثغرة PSFree...");

    // تحديد مسار البيلود بناءً على الإعدادات
    const flavor = localStorage.getItem('jbflavor') || 'GoldHEN';
    window.payload_path = (flavor === 'HEN') ? "payloads/HEN/HEN.bin" : "payloads/GoldHEN/GoldHEN.bin";

    window.log("البيلود المختار: " + window.payload_path);

    try {
        // استخدام مسار الاستيراد المباشر من الجذر لضمان عمل الأوفلاين
        await import('./psfree/alert.mjs');
    } catch (e) {
        // يظهر الخطأ هنا على الـ PC فقط، وهذا دليل على أن الزر يعمل
        alert("تنبيه: " + e.message);
        if (loader) loader.style.display = 'none';
        if (jbBtn) jbBtn.style.display = 'block';
    }
};

window.showsettings = function() {
    document.getElementById('settings-popup').style.display = 'block';
    document.getElementById('overlay-popup').style.display = 'block';
};

window.closesettings = function() {
    document.getElementById('settings-popup').style.display = 'none';
    document.getElementById('overlay-popup').style.display = 'none';
};

window.showabout = function() {
    document.getElementById('about-popup').style.display = 'block';
    document.getElementById('overlay-popup').style.display = 'block';
};

window.closeabout = function() {
    document.getElementById('about-popup').style.display = 'none';
    document.getElementById('overlay-popup').style.display = 'none';
};

window.choosejb = function(type) {
    localStorage.setItem('jbflavor', type);
    window.log("تم اختيار: " + type);
};

window.savejbflavor = function() {
    const radios = document.getElementsByName('hen');
    for (let r of radios) {
        if (r.checked) {
            localStorage.setItem('jbflavor', r.value);
            break;
        }
    }
};

// --- التهيئة عند التشغيل ---
window.onload = function() {
    window.CheckFW();

    // ربط الزر الرئيسي
    const btn = document.getElementById('jailbreak');
    if (btn) btn.onclick = window.jailbreak;

    // استعادة الإعدادات المحفوظة
    const savedFlavor = localStorage.getItem('jbflavor') || 'GoldHEN';
    const radio = document.querySelector(`input[value="${savedFlavor}"]`);
    if (radio) radio.checked = true;

    const ckbaj = document.getElementById('ckbaj');
    if (ckbaj) {
        ckbaj.checked = (localStorage.getItem('autojb') === 'true');
        ckbaj.onchange = function() { localStorage.setItem('autojb', ckbaj.checked); };
        
        if (ckbaj.checked && !sessionStorage.getItem('jbsuccess')) {
            setTimeout(window.jailbreak, 3000);
        }
    }

    const ckbdc = document.getElementById('ckbdc');
    const debugConsole = document.getElementById('DebugConsole');
    if (ckbdc && debugConsole) {
        ckbdc.checked = (localStorage.getItem('showdebug') !== 'false');
        debugConsole.style.display = ckbdc.checked ? 'block' : 'none';
        ckbdc.onchange = function() {
            localStorage.setItem('showdebug', ckbdc.checked);
            debugConsole.style.display = ckbdc.checked ? 'block' : 'none';
        };
    }
};
