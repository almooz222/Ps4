//------ Ballegh Store 2 - Optimized Payloads --------

// دالة جلب الملف وتحويله لبيانات باينري
var getPayload = function(payload, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', payload);
    req.send();
    req.responseType = "arraybuffer";
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
}

// دالة إرسال الملف إلى منفذ 9090 (GoldHEN BinLoader)
var sendPayload = function(url, data, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.send(data);
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
}

// الدالة الذكية: تحاول الإرسال عبر الشبكة، وإذا فشلت تستخدم الطريقة المباشرة
function Loadpayloadlocal(PLfile){
    var PS4IP = "127.0.0.1";
    var req = new XMLHttpRequest();
    req.open("POST", `http://${PS4IP}:9090/status`);
    req.send();
    
    req.onerror = function(){
        // إذا كان السيرفر غير يعمل، نستخدم الطريقة الاحتياطية
        Loadpayloadonline(PLfile);
    };

    req.onload = function(){
        var responseJson = JSON.parse(req.responseText);
        if (responseJson.status == "ready"){
            getPayload(PLfile, function (req) {
                if ((req.status === 200 || req.status === 304) && req.response) {
                    sendPayload(`http://${PS4IP}:9090`, req.response, function (res) {
                        if (res.status === 200) { console.log("Payload Sent!"); }
                    });
                }
            });
        } else {
            alert("سيرفر BinLoader مشغول حالياً!");
        }
    };
}

function Loadpayloadonline(PLfile) {
    window.payload_path = PLfile;
}

// --- الأدوات المعتمدة في المتجر (Tools) ---

export function load_GoldHEN() { Loadpayloadlocal("./payloads/GoldHEN/GoldHEN.bin"); }
export function load_FTP() { Loadpayloadlocal("./payloads/Bins/Tools/ftp.bin"); }
export function load_DisableUpdates() { Loadpayloadlocal("./payloads/Bins/Tools/disable-updates.bin"); }
export function load_EnableUpdates() { Loadpayloadlocal("./payloads/Bins/Tools/enable-updates.bin"); }
export function load_BackupDB() { Loadpayloadlocal("./payloads/Bins/Tools/backup.bin"); }
export function load_RestoreDB() { Loadpayloadlocal("./payloads/Bins/Tools/restore.bin"); }
export function load_PS4Debug() { Loadpayloadlocal("./payloads/Bins/Tools/ps4debug.bin"); }
export function load_ToDex() { Loadpayloadlocal("./payloads/Bins/Tools/ToDex.bin"); }
export function load_HistoryBlocker() { Loadpayloadlocal("./payloads/Bins/Tools/history-blocker.bin"); }

// --- مودات الألعاب (Game Mods) ---

export function load_GTAArbic() { Loadpayloadlocal("./payloads/Bins/GTA/ArabicGuy-1.0-1.27-rfoodxmodz.bin"); }
export function load_Oysters124() { Loadpayloadlocal("./payloads/Bins/RDR2/OystersMenu-1.24-FREE.bin"); }
export function load_Oysters129() { Loadpayloadlocal("./payloads/Bins/RDR2/OystersMenu-1.29-FREE.bin"); }
