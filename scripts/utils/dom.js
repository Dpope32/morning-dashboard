// scripts/utils/dom.js

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = content;
    }
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function updateElementClass(id, className) {
    const element = document.getElementById(id);
    if (element) {
        element.className = className;
    }
}

function updateElementStyle(id, style, value) {
    const element = document.getElementById(id);
    if (element) {
        element.style[style] = value;
    }
}
