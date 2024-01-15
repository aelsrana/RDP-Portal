if (!window.atob) {
    var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var table = tableStr.split("");

    window.atob = function (base64) {
        if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
        base64 = base64.replace(/=/g, "");
        var n = base64.length & 3;
        if (n === 1) throw new Error("String contains an invalid character");
        for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
            var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
            var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
            if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
            bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
            bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
            bin[bin.length] = ((c << 6) | d) & 255;
        };
        return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
    };

    window.btoa = function (bin) {
        for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
            var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
            if ((a | b | c) > 255) throw new Error("String contains an invalid character");
            base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                (isNaN(b + c) ? "=" : table[c & 63]);
        }
        return base64.join("");
    };

}

export function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
        str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

export function base64ToHex(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join(" ");
}

//Convert hex String To Byte Array
export var hexStringToByteArray = function (hexStr) {

    var result = [];

    hexStr = hexStr.replace(/-/g, ""); // remove "-" 
    for (var i = 0; i < hexStr.length; i = i + 2) {

        var hex = hexStr.substr(i, 2).toUpperCase();
        var number = parseInt(hex, 16);

        result.push(number);
    }

    return result;
}

//Convert Byte Array To Hex String
export var byteArrayToHexString = function (arr) {

    var result = "";

    for (var i = 0; i < arr.length; i++) {

        var hex = arr[i].toString(16);
        if (hex.length == 1)
            hex = "0" + hex;

        result += hex.toUpperCase();
    }

    return result;
}


export function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// Capitalize String
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//Formate Currency
export function formateCurrency(amount) {
    //var x = 12345652457.557;
    var x = amount.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
}



// Convert numbers to words
// copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
// permission to use this Javascript on your web page is granted
// provided that all of the code (including this copyright notice) is
// used exactly as shown (you can change the numbering system if you wish)

//
//<script type="text/javascript" src="toword.js"></script>
//var words = toWords(num);
//


// American Numbering System
var th = ['', 'thousand', 'million', 'billion', 'trillion'];
// uncomment this line for English Number System
// var th = ['','thousand','million', 'milliard','billion'];

var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
export function toWords(s) {
    s = s.toString(); s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s))
        return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1')
            { str += tn[Number(n[i + 1])] + ' '; i++; sk = 1; }
            else if (n[i] != 0)
            { str += tw[n[i] - 2] + ' '; sk = 1; }
        }
        else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred '; sk = 1;
        } if ((x - i) % 3 == 1) {
            if (sk)
                str += th[(x - i - 1) / 3] + ' '; sk = 0;
        }
    } if (x != s.length) {
        var y = s.length; str += 'point ';
        for (i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}


export function number2text(value) {
    var fraction = Math.round(frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
        f_text = "and " + convert_number(fraction) + " poisha";
    }

    return convert_number(value) + " taka " + f_text + " only";
}

export function frac(f) {
    return f % 1;
}

export function convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " crore");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " lakh");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " thousand");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " hundred");
    }


    var ones = Array("", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen");
    var tens = Array("", "", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " and ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "";
    }
    return res;
}
export function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : (event as any).keyCode;
    var target = evt.target || evt.srcElement;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if (charCode == 46 && target.value.split('.').length > 1) {

        return false;

    }

    if (target.selectionStart < target.selectionEnd) {
        return true;
    }

    if (target.value.split('.').length > 1 && target.value.split('.')[1].length == 2) {

        return false;
    }
    return true;
}

