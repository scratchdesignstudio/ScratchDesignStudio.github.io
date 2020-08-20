/**
 * Gets a cookie.
 * @param {string} name the name of the cookie
 * @returns {string | undefined} the value of the cookie if any, or undefined
 */
function getCookie(name) {
    const cookie = document.cookie.split(";").find(c => c.startsWith(name));
    return cookie ? cookie.split("=")[1] : undefined;
}

/**
 * Sets the value of a cookie.
 * @param {string} name the name of the cookie
 * @param {any} value the value of the cookie
 * @param {number} expire the expiration date, in milliseconds from now. default value is 30 days
 * @returns {void} nothing
 */
function setCookie(name, value, expire = 30 * 24 * 60 * 60 * 1000) {
    document.cookie = `${name}=${value.toString()};${new Date().getTime() + expire};path=/`;
}

window.addEventListener("load", () => {

    /**
     * The id of the dropdown to switch languages.
     * @type {HTMLElement}
     */
    const dropdown = document.getElementById("dropdown");

    /**
     * The name of the cookie storing the user language.
     * @type {string}
     */
    const languageCookieName = "sdsLanguage";

    /**
     * All the supported languages, retrieved from the JSON file.
     * @type {string[]}
     */
    const supportedLanguages = [];

    /**
     * The code of the fallback language.
     * @type {string}
     */
    const defaultLanguage = "en";

    /**
     * Loads the available languages.
     * There is only 1 (one) JSON file with all languages for all the sub-website,
     * which is located in scratchdesignstudio.github.io/i18n/supportedLanguages
     * 
     * The language selector in the navbar is then updated.
     */
    fetch(`${document.location.protocol}//${document.location.host}/i18n/supportedLanguages.json`)
    .then(r => r.json())
    .then(r => {
        r.forEach(e => {
            let option = document.createElement("option");
            option.value = e.code;
            option.innerText = e.name;
            dropdown.appendChild(option);
            supportedLanguages.push(e.code);
        });
    });



    /**
     * When the user changes the language using the dropdown,
     * updates the content of the website and
     * updates the cookie storing the selected language
     */
    dropdown.addEventListener("change", () => {
        const newLanguage = supportedLanguages.includes(dropdown.value) ? dropdown.value : defaultLanguage;
        fetch(`${document.location.protocol}//${document.location.host}/i18n/global/${newLanguage}.json`)
        .then(res => res.json())
        .then(obj => Object.keys(obj)
            .forEach(key => {
                if(obj[key] instanceof Array) {
                    Array.from(document.getElementsByClassName(key)).forEach(el => {
                        el.innerText = "";
                        Array.from(el.children).forEach(c => c.parentElement.removeChild(c));
                        obj[key].forEach(v => {
                            const span = document.createElement("span");
                            span.innerText = v;
                            el.appendChild(span);
                        });
                    });
                } else {
                    Array.from(document.getElementsByClassName(key)).forEach(el => el.innerText = obj[key]);
                }
                try {
                    document.getElementById(key).innerText = obj[key];
                } catch(err) { }
            })
        )
        .then(und => setCookie(languageCookieName, newLanguage));

        fetch(`./i18n/local/${newLanguage}.json`)
        .then(res => res.json())
        .then(obj => Object.keys(obj)
            .forEach(key => {
                if(obj[key] instanceof Array) {
                    Array.from(document.getElementsByClassName(key)).forEach(el => {
                        el.innerText = "";
                        Array.from(el.children).forEach(c => c.parentElement.removeChild(c));
                        obj[key].forEach(v => {
                            const span = document.createElement("span");
                            span.innerText = v;
                            el.appendChild(span);
                        });
                    });
                } else {
                    Array.from(document.getElementsByClassName(key)).forEach(el => el.innerText = obj[key]);
                }
                try {
                    document.getElementById(key).innerText = obj[key];
                } catch(err) { }
            })
        );
    });

    /**
     * Check for language cookie.
     * If a cookie is found, updates the site to the desired language.
     * 
     * Default language is English.
     */
    const cookie = getCookie(languageCookieName);
    console.log(cookie);
    dropdown.value = cookie && supportedLanguages.includes(cookie) ? cookie : defaultLanguage;
    dropdown.dispatchEvent(new Event("change"));

});
