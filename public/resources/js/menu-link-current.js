{
    document.addEventListener('DOMContentLoaded', () => {
        const menu = document.querySelector('.page-header__menu');
        for (const child of menu.querySelectorAll('.page-header__menu-link')) {
            if (child.classList.contains('page-header__menu-link')) {
                const linkText = child.textContent;
                if (!linkText) continue;
                if (linkText === currentPageSection) {
                    child.classList.add('page-header__menu-link--current');
                }
            }
        }
    });
}