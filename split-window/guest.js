
document.getElementById("userID").value = data.guestUserId;
document.getElementById("password").value = data.guestPassword;

setTimeout(() => {

    document.getElementById("logbutton").click();
    document.getElementById("PIN").value = data.guestPIN;

    setTimeout(() => {
        document.getElementById("submitId").click(); 
    }, 1000);

}, 1000);

