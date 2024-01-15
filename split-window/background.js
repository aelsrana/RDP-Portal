var guestUserId;
var guestPassword;
var guestPIN;
var hostWindowId = null;
var guestWindowId = null;
var guestTabId = null;

chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => {
            chrome.tabs.remove(tabs[0].id, () => {});
        }
    );

    chrome.windows.create(
        {
            url: 'https://35.200.184.42',
            type: 'popup',
            top: 0,
            left: 0
        },
        (window) => {
            hostWindowId = window.id;
            chrome.windows.update(window.id, {
                state: 'maximized'
            }, function () { });
            chrome.tabs.executeScript(window.tabs[0].id, {
                file: "host.js"
            });
            chrome.windows.onRemoved.addListener(OnHostClose);
        }
    );
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    const values = message.split(',');
    const guestURL = values[0];
    guestUserId = values[1];
    guestPassword = values[2];
    guestPIN = values[3];
    const eventType = values[4];

    if (eventType === "verifyExHouse") {
        var updateHostWindow = {
            top: 0,
            left: 0,
            width: screen.availWidth / 2,
            height: screen.availHeight
        };
        chrome.windows.update(hostWindowId, updateHostWindow);

        chrome.windows.create(
            {
                url: guestURL,
                type: 'popup',
                top: 0,
                left: screen.availWidth / 2,
                width: screen.availWidth / 2,
                height: screen.availHeight
            },
            (window) => {
                guestWindowId = window.id;
                guestTabId = window.tabs[0].id;
                chrome.tabs.onUpdated.addListener(Login);
                chrome.windows.onRemoved.addListener(OnGuestClose);
            }
        );
    }
    else if (eventType === "cancel") {
        OnHostClose();
        OnGuestClose();
    }
});

function Login(tabId, info) {
    if (info.status === 'complete') {
        chrome.tabs.executeScript(guestTabId, {
            code: `var data = ${JSON.stringify({
                guestUserId,
                guestPassword,
                guestPIN
            })}`
        },
            function (tab) {
                chrome.tabs.executeScript(guestTabId, {
                    file: 'guest.js'
                });
                chrome.tabs.onUpdated.removeListener(Login);
            });
    }
}

function OnHostClose(windowId) {
    chrome.windows.remove(guestWindowId);
}

function OnGuestClose(windowId) {
    var updateHostWindow = {
        top: 0,
        left: 0,
        state: 'maximized'
    };
    chrome.windows.update(hostWindowId, updateHostWindow);
}

