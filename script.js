let currentLang = localStorage.getItem('language') || 'cs';
let currentTheme = localStorage.getItem('theme') || 'dark';

const themeLink = document.getElementById('themeLink');

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
    themeLink.href = theme === 'light' ? 'style_light.css' : 'style_dark.css';
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
   
    setLanguage(currentLang);
    setTheme(currentTheme);

   
    const selected = document.querySelector('.select-selected');
    const itemsContainer = document.querySelector('.select-items');

    if(selected && itemsContainer){
        selected.addEventListener('click', () => {
            itemsContainer.classList.toggle('select-hide');
        });

        itemsContainer.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                setLanguage(lang);
                selected.innerHTML = item.innerHTML;
                itemsContainer.classList.add('select-hide');
            });
        });

        document.addEventListener('click', (e) => {
            if(!e.target.closest('.custom-select')) itemsContainer.classList.add('select-hide');
        });
    }

    const themeSwitcher = document.getElementById('themeSwitcher');
    if(themeSwitcher){
        themeSwitcher.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
});
