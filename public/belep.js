async function belepes() {
    const nev = document.querySelector('#nev').value;
    const jelszo = document.querySelector('#jelszo').value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nev, jelszo }),
    });

    const valasz = await response.json();

    if (response.ok && valasz.belep) {
        document.getElementById('login-kontener').style.display = 'none';
    } else {
        window.alert('Nem léphetsz be!');
    }
}
