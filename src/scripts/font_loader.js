document.addEventListener("DOMContentLoaded", function () {
    loadFonts();
});

function loadFonts() {
    WebFontConfig = {
        google: {
            families: ['M+PLUS+Rounded+1c:400,800','Noto+Sans+JP:500,700']
        },
        custom: {
            families: ['Font Awesome\ 5 Icons:400,900', 'Font Awesome\ 5 Brands:400'],
            urls: ['https://use.fontawesome.com/releases/v5.6.4/css/all.css']
        },
        active: function() {
            sessionStorage.fonts = true;
        }
    };
      
    (function(d) {
        var wf = d.createElement('script'), s = d.scripts[0];
        wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
        wf.async = true;
        s.parentNode.insertBefore(wf, s);
    })(document);
}
