let currentLang = localStorage.getItem('language') || 'cs';
let currentTheme = localStorage.getItem('theme') || 'dark';

function setLanguage(lang) {
    fetch(`Lang/${lang}.json`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            document.querySelectorAll('[data-lang]').forEach(el => {
                const key = el.getAttribute('data-lang');
                if (data[key]) el.innerHTML = data[key];
            });
            currentLang = lang;
            localStorage.setItem('language', lang);
            
            const itemsContainer = document.querySelector('.select-items');
            if (itemsContainer) {
                const activeItem = itemsContainer.querySelector(`[data-lang="${currentLang}"]`);
                const selected = document.querySelector('.select-selected');
                if (activeItem && selected) {
                     selected.innerHTML = activeItem.innerHTML;
                }
            }
        })
        .catch(err => {
            console.error("Ошибка загрузки файла перевода:", err);
            console.log("Убедитесь, что файлы .json лежат в папке 'Lang' и запущен локальный сервер.");
        });
}

function setTheme(theme) {
    const themeLink = document.getElementById('themeLink');
    const switcherImg = document.getElementById('themeSwitcher');
    
    if (theme === 'dark') {
        themeLink.href = 'style_dark.css';
        if(switcherImg) switcherImg.src = 'img/sun.png';
    } else {
        themeLink.href = 'style_light.css';
        if(switcherImg) switcherImg.src = 'img/moon.png';
    }
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    setTheme(currentTheme);

    const selected = document.querySelector('.select-selected');
    const itemsContainer = document.querySelector('.select-items');
    
    if (selected && itemsContainer) {
        const activeItem = itemsContainer.querySelector(`[data-lang="${currentLang}"]`);
        if (activeItem) selected.innerHTML = activeItem.innerHTML;

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
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

        document.addEventListener('click', e => {
            if (!e.target.closest('.custom-select')) {
                itemsContainer.classList.add('select-hide');
            }
        });
    }

    const themeSwitcher = document.getElementById('themeSwitcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    const skillBars = document.querySelectorAll('.skill-fill');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) {
                        bar.style.width = targetWidth;
                    }
                    observer.unobserve(bar); 
                }
            });
        }, { threshold: 0.2 });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
});