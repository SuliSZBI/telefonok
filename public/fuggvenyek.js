function sorbarak(tomb) {
    for (let i = 0; i < tomb.length - 1; i++) {
        for (let j = i + 1; j < tomb.length; j++) {
            if (tomb[j][4] <= tomb[i][4]) {
                let elem = tomb[j];
                tomb[j] = tomb[i];
                tomb[i] = elem;
            }
        }
    }
}

function kiir() {
    osztalyokKontener.innerHTML = `<button onClick="filebaIr()">Fileba kiir</button>
    <button onClick="torol()">Adatok törlése</button><button onClick="kilep()">Kilépés</button>`;
}

async function feltolt() {
    try {
        console.log(osztalyokSuli);

        let response = await fetch('http://localhost:5000/feltolt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ osztalyokSuli }),
        });
    } catch (error) {
        console.log('Hiba: ' + error.message);
    }
}
