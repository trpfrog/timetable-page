function setToolbarColor() {
    const selector = document.querySelector(':root');
    const computedStyle = window.getComputedStyle(selector);
    const color = computedStyle.getPropertyValue('--header-background-color');
    const html = `<meta name="theme-color" content="${color}">`;
    document.head.insertAdjacentHTML('beforeend', html);
}

window.onload = setToolbarColor;
