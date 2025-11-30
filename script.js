let currentLang = localStorage.getItem('language') || 'cs';
function setLanguage(lang) {
    fetch(`Lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('[data-lang]').forEach(el => {
                const key = el.getAttribute('data-lang');
                if (data[key]) {
                    el.innerHTML = data[key];
                }
            });
            currentLang = lang;
            localStorage.setItem('language', lang);
            
        })
        .catch(err => console.error("Ошибка загрузки языка:", err));
}
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
});


const langSelect = document.getElementById('languageSelect');

document.addEventListener('DOMContentLoaded', () => {
    langSelect.value = localStorage.getItem('language') || 'cs';
    setLanguage(langSelect.value);


});

langSelect.addEventListener('change', () => {
    setLanguage(langSelect.value);
});
