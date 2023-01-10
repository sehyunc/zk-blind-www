var options = {
    header_name: "authorization",
    header_prefix: ["Bearer "],
    copy_prefix: false
};

function setOptions(o) {
    options.header_name = o.header_name.toLowerCase().trim();
    options.header_prefix = typeof o.header_prefix == "string" ? o.header_prefix.split(',') : o.header_prefix;
    options.copy_prefix = o.copy_prefix;
    for(var i = 0 ; i<options.header_prefix.length ; i++) {
      if(options.header_prefix[i].trim().length>0 && !options.header_prefix[i].endsWith(' ')) {
        options.header_prefix[i] += ' ';
      }
    }
    // var caption = document.getElementById("caption");
    // var p = options.header_prefix.length>1 ? '{'+options.header_prefix.join()+'}' : options.header_prefix[0];
    // caption.innerHTML = 'Waiting for request with <b>'+Encoder.htmlEncode(o.header_name)+
    //                     ': '+Encoder.htmlEncode(p)+' [token]</b>'+
    //                     '<br>(Go to <b>Extentions > JWT Inspector > Options</b> to customize)';
  }

function bearer_token(h) {
    if(h && h.name && h.name.toLowerCase() == options.header_name && h.value) {
        var p = options.header_prefix.find( s => h.value.startsWith(s) );
        if(p) {
        return { prefix:p , tok:h.value.substring(p.length) };
        }
    }
    return null;
}

function onRequestFinished(request) {
    var h = bearer_token(request.request.headers.find(bearer_token));
    if(!h) return;
    try {
      var parts = h.tok.split('.');
      var header = JSON.parse(atob(parts[0]));
      var claims = JSON.parse(atob(parts[1]));
      render(header, claims, request.request.url, request.startedDateTime);
      updateCopyButton(h.prefix,h.tok);
    } catch (error) {
      // Not a token we can extract and decode
    }
}

function copyToken() {
    var t = this.dataset.token;
    copyTextToClipboard(t);
}

chrome.devtools.network.onRequestFinished.addListener(onRequestFinished);
window.onload = function() {
  document.getElementById("copy_token").onclick = copyToken;
  chrome.storage.local.get(options, setOptions);
};
chrome.storage.onChanged.addListener( function(changes, namespace) {
  chrome.storage.local.get(options, setOptions);
});