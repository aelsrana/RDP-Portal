$(function () {
    $("body").on('click keypress mouseover', function () {
        ResetThisSession();
    });
});

// init();

// function loadJSON(callback) {   
//     var xobj = new XMLHttpRequest();
//         xobj.overrideMimeType("application/json");
//     xobj.open('GET', './assets/conf/global-config.json', true);
//     xobj.onreadystatechange = function () {
//             if (xobj.readyState == 4 && xobj.status == "200") {
//             callback(xobj.responseText);
//             }
//     };
//     xobj.send(null);  
// }

// var actual_JSON;
// var timeInSecondsAfterSessionOut;
// function init() {
//     loadJSON(function(response) {
//          actual_JSON = JSON.parse(response)
//          timeInSecondsAfterSessionOut = actual_JSON.autoLogoutInSec;
//     });
// }

function ReloadUrl(){
    return 'login';
}


var timeInSecondsAfterSessionOut = 1800; // change this to change session time out (in seconds).
var secondTick = 0;

function ResetThisSession() {
    secondTick = 0;
}

function StartThisSessionTimer() {
    secondTick++;
    // var timeLeft = ((timeInSecondsAfterSessionOut + 1 - secondTick) / 60).toFixed(0); // in minutes
    var timeLeft = timeInSecondsAfterSessionOut + 1 - secondTick; // override, we have 30 secs only 

    $("#spanTimeLeft").html(timeLeft);

    if (secondTick > timeInSecondsAfterSessionOut) {
        clearTimeout(tick);
        window.location = ReloadUrl();
        return;
    }
    tick = setTimeout("StartThisSessionTimer()", 1000);
}
StartThisSessionTimer();
    