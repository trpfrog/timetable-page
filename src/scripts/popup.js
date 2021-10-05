let mouseX = 0, mouseY = 0;

window.onload=function(){
    document.body.addEventListener("mousemove", function(e){
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

function noScroll(event) {
    event.preventDefault();
}

function idPassPopup(id, pass) {
    const msg = 'Click to copy';
    const html = `
        <div id="idpass-balloon" style="left: ${mouseX - 160}px; top: ${mouseY - 135}px;">
            <p><b>ID / Password</b><br><span id="idpass-balloon-msg" style="font-size: 0.5em">${msg}</span></p>
            <input type="text" id="popup-id" value="${id}" onclick="copyId()" readonly>
            <input type="password" id="popup-pass" value="${pass}" onclick="copyPassword()" readonly>
        </div>
    `;
    showPopup(html);
}

function copyId() {
    const id = document.getElementById('popup-id').value;
    navigator.clipboard.writeText(id)
        .then(() => {
            document.getElementById('idpass-balloon-msg').innerHTML = 'Your ID has been copied!';
        });
}

function copyPassword() {
    const pass = document.getElementById('popup-pass').value;
    navigator.clipboard.writeText(pass)
        .then(() => {
            document.getElementById('idpass-balloon-msg').innerHTML = 'Your password has been copied!';
        });
}

function showPopup(html) {
    document.addEventListener('touchmove', noScroll, { passive: false });
    document.addEventListener('mousewheel', noScroll, { passive: false });
    document.getElementById('gray_cover_inside').innerHTML  = html;
    document.getElementById('gray_cover').style.visibility = 'visible';
    document.getElementById('gray_cover_inside').style.visibility = 'visible';
}

function hidePopup() {
    document.removeEventListener('touchmove', noScroll, { passive: false });
    document.removeEventListener('mousewheel', noScroll, { passive: false });
    document.getElementById('gray_cover_inside').innerHTML = '';
    document.getElementById('gray_cover').style.visibility = 'hidden';
    document.getElementById('gray_cover_inside').style.visibility = 'hidden';
}
