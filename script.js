let currentLang = localStorage.getItem('language') || 'cs';
let currentTheme = localStorage.getItem('theme') || 'dark';

function setLanguage(lang) {
    fetch(`Lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('[data-lang]').forEach(el => {
                const key = el.getAttribute('data-lang');
                if (data[key]) el.innerHTML = data[key];
            });
            currentLang = lang;
            localStorage.setItem('language', lang);
        })
        .catch(err => console.error("Ошибка загрузки языка:", err));
}

function setTheme(theme) {
    const themeLink = document.getElementById('themeLink');
    if (theme === 'dark') {
        themeLink.href = 'style_dark.css';
        document.getElementById('themeSwitcher').src = 'img/sun.png';
    } else {
        themeLink.href = 'style_light.css';
        document.getElementById('themeSwitcher').src = 'img/moon.png';
    }
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    setTheme(currentTheme);

    const selected = document.querySelector('.select-selected');
    const itemsContainer = document.querySelector('.select-items');
    const activeItem = itemsContainer.querySelector(`[data-lang="${currentLang}"]`);
    if (activeItem) selected.innerHTML = activeItem.innerHTML;

    selected.addEventListener('click', () => itemsContainer.classList.toggle('select-hide'));
    itemsContainer.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.getAttribute('data-lang');
            setLanguage(lang);
            selected.innerHTML = item.innerHTML;
            itemsContainer.classList.add('select-hide');
        });
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.custom-select')) itemsContainer.classList.add('select-hide');
    });

    document.getElementById('themeSwitcher').addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});
