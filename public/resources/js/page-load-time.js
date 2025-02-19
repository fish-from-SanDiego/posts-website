(function () {
    const scriptStartTime = Date.now();
    let domLoadDelta;
    let pageLoadDelta;
    const onDOMLoad = () => {
        domLoadDelta = (Date.now() - scriptStartTime) / 1000;
    };
    const onPageLoad = () => {
        pageLoadDelta = (Date.now() - scriptStartTime) / 1000;
        const sidebarElement = document.querySelector('.aside');
        if (sidebarElement) {
            const text = document.createElement('p');
            text.classList.add('aside__item-text');
            text.innerHTML = `Кстати, эта страница загрузилась за ${pageLoadDelta} секунд! (а DOM - за ${domLoadDelta})`;
            const newItem = document.createElement('div');
            newItem.classList.add('aside__item');
            newItem.appendChild(text);
            sidebarElement.appendChild(newItem);
        }
    };
    document.addEventListener('DOMContentLoaded', onDOMLoad);
    window.addEventListener('load', onPageLoad);
})();