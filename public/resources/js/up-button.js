{

    window.addEventListener('scroll', hideUpButtonIfNeeded);
    document.addEventListener('DOMContentLoaded', () => {
        const buttonElement = document.documentElement.querySelector('.main__up-button');
        buttonElement?.addEventListener('click', onUpButtonClick);
    });

    function onUpButtonClick() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function hideUpButtonIfNeeded() {
        const footerElement = document.querySelector('.page-footer');
        const windowHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const footerCoords = footerElement.getBoundingClientRect();
        const buttonElement = document.querySelector('.main__up-button');
        if (!buttonElement) return;
        const buttonClasses = buttonElement.classList;
        if (!buttonElement) return;
        if (window.scrollY === 0 || (footerCoords.top - windowHeight) <= 0)
            buttonClasses.add('main__up-button--hidden');
        else
            buttonClasses.remove('main__up-button--hidden');
    }
}