async function torol() {
    let valasz = window.confirm('Tényleg törölni akarod az adatokat: ');

    if (valasz) {
        try {
            let response = await fetch(`http://localhost:5000/torol`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ szoveg: 'Törlés!' }),
            });

            let valasz = await response.json();

            if (response.ok) {
                window.alert(valasz.msg);
            } else {
                window.alert(valasz.msg);
            }
        } catch (error) {
            console.log('Hiba: ' + error.message);
        }
    }
}

function kilep() {
    document.getElementById('login-kontener').style.display = 'flex';
}
