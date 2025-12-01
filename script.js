let currentLang = localStorage.getItem('language') || 'cs';
let currentTheme = localStorage.getItem('theme') || 'dark';

// === LANGUAGE HANDLING ===
function setLanguage(lang) {
    fetch(`Lang/${lang}.json`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
                if (activeItem && selected) selected.innerHTML = activeItem.innerHTML;
            }
        })
        .catch(err => console.error("Language load error:", err));
}

// === THEME HANDLING (SMOOTH) ===
function setTheme(theme) {
    const switcherImg = document.getElementById('themeSwitcher');
    
    // Toggle class on body
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if(switcherImg) switcherImg.src = 'img/moon.png';
    } else {
        document.body.classList.remove('light-theme');
        if(switcherImg) switcherImg.src = 'img/sun.png';
    }
    
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {

    // (FADE IN) 
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);

    // (FADE OUT) 
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('#') && !link.target && href !== window.location.pathname.split('/').pop()) {
                e.preventDefault();
                document.body.classList.remove('loaded'); 

                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            }
        });
    });
    // Apply saved settings
    setLanguage(currentLang);
    setTheme(currentTheme);

    // Language Menu Logic
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
            if (!e.target.closest('.custom-select')) itemsContainer.classList.add('select-hide');
        });
    }

    // Theme Switcher Logic
    const themeSwitcher = document.getElementById('themeSwitcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            // Toggle theme
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Skills Animation
    const skillBars = document.querySelectorAll('.skill-fill');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth) bar.style.width = targetWidth;
                    observer.unobserve(bar); 
                }
            });
        }, { threshold: 0.2 });
        skillBars.forEach(bar => observer.observe(bar));
    }

    // Copy Code Button
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.code-window').querySelector('code');
            const codeText = codeBlock.innerText;

            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = button.innerText;
                button.innerText = "Copied!";
                button.style.borderColor = "#27c93f";
                button.style.color = "#27c93f";
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.borderColor = "";
                    button.style.color = "";
                }, 2000);
            }).catch(err => console.error('Copy failed:', err));
        });
    });
});