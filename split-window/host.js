
window.onload = function () {
    var guestURL = "https://35.200.184.42/xpress-money"; 
    var guestUserId = "admin";
    var guestPassword = "admin"; 
    var guestPIN = 1234; 

    setInterval(() => {
        if (document.getElementById("verifyExHouseId")) {
            document.getElementById("verifyExHouseId").onclick = function (event) {
                if (document.getElementById("pinNumber")) {
                    guestPIN = document.getElementById("pinNumber").value;
                }
                let message = guestURL + ',' + guestUserId + ',' + guestPassword + ',' + guestPIN + ',' + "verifyExHouse";
                chrome.runtime.sendMessage(message);
            };
        }

        if (document.getElementById("goBackId")) {
            document.getElementById("goBackId").onclick = function (event) {
                if (document.getElementById("pinNumber")) {
                    guestPIN = document.getElementById("pinNumber").value;
                }
                let message = guestURL + ',' + guestUserId + ',' + guestPassword + ',' + guestPIN + ',' + "cancel";
                chrome.runtime.sendMessage(message);
            };
        }

        if (document.getElementById("submitId")) {
            document.getElementById("submitId").onclick = function (event) {
                if (document.getElementById("pinNumber")) {
                    guestPIN = document.getElementById("pinNumber").value;
                }
                let message = guestURL + ',' + guestUserId + ',' + guestPassword + ',' + guestPIN + ',' + "cancel";
                chrome.runtime.sendMessage(message);
            };
        }

        if (document.getElementById("cancelYesId")) {
            document.getElementById("cancelYesId").onclick = function (event) {
                if (document.getElementById("pinNumber")) {
                    guestPIN = document.getElementById("pinNumber").value;
                }
                let message = guestURL + ',' + guestUserId + ',' + guestPassword + ',' + guestPIN + ',' + "cancel";
                chrome.runtime.sendMessage(message);
            };
        }

    }, 500);
}