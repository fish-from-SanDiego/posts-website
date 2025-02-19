{
    document.addEventListener('DOMContentLoaded', () => {
        const menu = document.querySelector('.page-header__menu');
        const pageName = window.location.pathname.split('/').pop();
        for (const child of menu.querySelectorAll('.page-header__menu-link')) {
            if (child.classList.contains('page-header__menu-link')) {
                const link = child.getAttribute('href');
                if (!link) continue;
                if (link.substring(link.lastIndexOf('/') + 1) === pageName) {
                    child.classList.add('page-header__menu-link--current');
                }
            }
        }
    });
}