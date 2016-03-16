
function createRequestObject() {
    var request_o;
    var browser = navigator.appName;
    if (browser == "Microsoft Internet Explorer"){
        request_o = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        request_o = new XMLHttpRequest();
    }
    return request_o;
}

function canHandleOnPress() {
	var browser = navigator.userAgent;
	//alert(browser);
	if (browser.indexOf('Safari') >= 0) {
		//alert("Safari");
		return true;
	} else {
		return false;
	}
}

function setLetter(cipher, clear) {
    //alert("Setting " + cipher + " equal to " + clear);
    window.status = window.status + " " + cipher + "=" + clear;
    var cqgrid = document.getElementById('cryptogrid');
    var input_list = cqgrid.getElementsByTagName('input');
    for (i=0; i < input_list.length; i++) {
        if (input_list[i].getAttribute('class') == cipher) {
        	//alert(i);
            input_list[i].setAttribute('value', clear);
            input_list[i].value = clear;
        }
    }
}

var http = createRequestObject();
var usedletters = '';
var goodbrowser = canHandleOnPress();
//alert("Good browser? " + goodbrowser);

function setWordHints() {
    if (http.readyState == 4) {
        var listarea = document.getElementById('hints');
        listarea.innerHTML = "<pre>" + http.responseText + "</pre>";
    }
}

function getWordHint(obj) {
    var regex = "";
    var input;
    var thischar = '';
    var word_obj = obj.parentNode.parentNode;
    var letters = word_obj.getElementsByTagName('input');
    //alert(letters.length);
    for (i=0; i < letters.length; i++) {
        //input = letters[i].getElementsByTagName('input');
        thischar = letters[i].getAttribute('value');
        //alert(i + ": " + thischar);
        if (thischar == null || thischar == '') {
            regex = regex + ".";
        } else {
            regex = regex + thischar.toLowerCase();
        }
    }
    http.open('get', 'ajax_server?action=1&data=' + regex);
    http.onreadystatechange = setWordHints;
    http.send(null);
    //setWordHints();
}

function getkey(e) {
    if (window.event) {
        return window.event.keyCode;
    } else if (e) {
        return e.which;
    }
    return null;
}

function setkey(e, keyval) {
    if (window.event) {
        window.event.keyCode = keyval;
    } else if (e) {
        e.which = keyval;
    }
}

function set_form_order(form) {
	var fields = form.elements;
	var a = [];
	//alert(fields.length);
	// add ENTER listeners
	for (var ii = fields.length; ii--;) {
		if (fields[ii].type == "text") {
			a[a.length] = fields[ii];
		}
	}
	
	// init the tabIndex behavior
	a.sort(
	function(a,b) {
		return a.tabIndex > b.tabIndex ? 1 : -1;
	}
	);
	
	for (var j = 0; j < a.length; j++){
		a[j].next = a[j+1] || a[0];
	}
}

function page_load() {
	set_form_order(document.forms[0]);
	document.forms[0].elements[0].focus();
}

function handleLetter(clear, cipher) {

}

function capitalize(obj) {
	var txt = obj.value;
	txt = txt.toUpperCase();
	obj.value = txt;
}

function letterTyped(e, cipher, obj) {
    var key, keychar;
    var valid = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = getkey(e);
    if (key == 9 || key == 25) { return true; }
    if (key == 8) {
    	setLetter(cipher, '');
    	return true;
    }
    if (key == 32) {
        getWordHint(obj);
        return false;
    }
    keychar = String.fromCharCode(key);
    keychar = keychar.toUpperCase();
    window.status = key + " / " + keychar;
    if (valid.indexOf(keychar) == -1) {
        return false;
    }
    //setkey(e, keychar.charCodeAt(0));
    setLetter(cipher, keychar);
    setTimeout(function(){ obj.next.focus(); }, 2);
    //obj.next.focus();
    return true;
}