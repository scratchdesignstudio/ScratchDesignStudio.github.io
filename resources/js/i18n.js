window.addEventListener("load", () => {
    fetch("/i18n/supportedLanguages.json")
    .then(r => r.json())
    .then(r => {
        r.forEach(e => {
            let option = document.createElement("option");
            option.value = e.code;
            option.innerText = e.name;
            document.getElementById("dropdown").appendChild(option);
        });
    });

    document.getElementById("dropdown").addEventListener("change", () => {
        fetch(`/i18n/general/${document.getElementById("dropdown").value}.json`)
        .then(r => r.json())
        .then(r => {
            Object.keys(r).forEach(k => {
                try {
                    document.getElementById(k).innerText = r[k];
                } catch { }
            });
        });
    });
});
