let osztalyokKontener = document.querySelector('#osztalyok-kontener');

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

async function betolt(osztaly) {
    osztalyokKontener.innerHTML = null;
    let ls = [];

    try {
        const response = await fetch(`http://localhost:5000/beolvas`);

        const valasz = await response.json();

        if (response.ok) {
            let valaszLista = valasz.lista;
            let tombLista = valaszLista.split('\n');

            for (let i = 0; i < tombLista.length - 1; i++) {
                let tomb = tombLista[i].split(';');

                let t = [];
                t.push(tomb[0]);
                t.push(tomb[1]);
                t.push(tomb[2]);
                t.push(tomb[3]);
                t.push(Date.parse(tomb[4]));

                ls.push(t);
            }
        }
    } catch (error) {
        console.log(error.message);
    }

    sorbarak(ls);
    console.log(ls);

    for (let i = 0; i < osztalyokSuli.length; i++) {
        if (osztaly === osztalyokSuli[i].osztaly) {
            for (let j = 0; j < osztalyokSuli[i].tanulok.length; j++) {
                let osztalyTanulo = document.createElement('div');
                osztalyTanulo.setAttribute('class', 'osztalyTanulo');
                let nev = document.createElement('span');
                nev.innerText = osztalyokSuli[i].tanulok[j];
                osztalyTanulo.appendChild(nev);
                let gombok = document.createElement('div');
                gombok.setAttribute('class', 'gombok');
                let leGomb = document.createElement('button');
                leGomb.setAttribute('class', 'legomb');
                leGomb.innerText = 'Le';
                leGomb.addEventListener('click', () =>
                    leGombMuvelet(osztalyokSuli[i].tanulok[j], j, osztaly)
                );
                gombok.appendChild(leGomb);
                let leSzoveg = document.createElement('span');
                leSzoveg.setAttribute('class', 'leszoveg');
                gombok.appendChild(leSzoveg);
                let felGomb = document.createElement('button');
                felGomb.setAttribute('class', 'felgomb');
                felGomb.innerText = 'Fel';
                felGomb.addEventListener('click', () =>
                    felGombMuvelet(osztalyokSuli[i].tanulok[j], j, osztaly)
                );
                felGomb.disabled = true;
                gombok.appendChild(felGomb);
                let felSzoveg = document.createElement('span');
                felSzoveg.setAttribute('class', 'felszoveg');
                gombok.appendChild(felSzoveg);
                osztalyTanulo.appendChild(gombok);
                osztalyokKontener.appendChild(osztalyTanulo);

                for (let k = 0; k < ls.length; k++) {
                    if (
                        ls[k][0].trim() === osztaly &&
                        ls[k][1].trim() === osztalyokSuli[i].tanulok[j] &&
                        ls[k][2].trim() === 'le'
                    ) {
                        leGomb.disabled = true;
                        felGomb.disabled = false;
                        osztalyTanulo.style.backgroundColor = '#fa71714d';
                        leSzoveg.innerText = ls[k][3].trim();
                    } else if (
                        ls[k][0].trim() === osztaly &&
                        ls[k][1].trim() === osztalyokSuli[i].tanulok[j] &&
                        ls[k][2].trim() === 'fel'
                    ) {
                        leGomb.disabled = true;
                        felGomb.disabled = true;
                        osztalyTanulo.style.backgroundColor = 'lightgreen';
                        felSzoveg.innerText = ls[k][3].trim();
                    }
                }
            }
        }
    }
}

function kilep() {
    window.location.href = '/';
}
