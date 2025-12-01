let currentLang = localStorage.getItem('language') || 'cs';
let currentTheme = localStorage.getItem('theme') || 'dark';

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

function setTheme(theme) {
    const switcherImg = document.getElementById('themeSwitcher');
    
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

function setupMobileNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            
            const headerInner = document.querySelector('.header__inner');
            if (headerInner) {
                headerInner.insertBefore(menuBtn, document.querySelector('.langswitcher'));
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: transparent;
                border: none;
                color: var(--accent-yellow);
                font-size: 32px;
                cursor: pointer;
            `;
            nav.appendChild(closeBtn);
            
            menuBtn.addEventListener('click', () => {
                nav.style.left = '0';
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
            
            closeBtn.addEventListener('click', () => {
                nav.style.left = '-100%';
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            overlay.addEventListener('click', () => {
                nav.style.left = '-100%';
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.style.left = '-100%';
                    overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            });
        }
    } else {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const overlay = document.querySelector('.nav-overlay');
        
        if (menuBtn) menuBtn.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        
        nav.style.cssText = '';
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);

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
            if (!e.target.closest('.custom-select')) itemsContainer.classList.add('select-hide');
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
                    if (targetWidth) bar.style.width = targetWidth;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });
        skillBars.forEach(bar => observer.observe(bar));
    }

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