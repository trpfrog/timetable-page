document.addEventListener("DOMContentLoaded", function () {
    setToolbarColor();
});

function setToolbarColor() {
    const computedStyle = window.getComputedStyle(document.documentElement);
    const color = computedStyle.getPropertyValue('--header-background-color');
    const html = `<meta name="theme-color" content="${color}">`;
    document.head.insertAdjacentHTML('beforeend', html);
}
