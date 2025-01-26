let osztalyokKontener = document.querySelector('#osztalyok-kontener');

function betolt(osztaly) {
    osztalyokKontener.innerHTML = null;
    let ls = [];

    for (let i = 0; i < localStorage.length; i++) {
        let tomb = localStorage.key(i).split(';');
        // console.log(tomb);
        let t = [];
        t.push(tomb[0]);
        t.push(tomb[1]);
        t.push(tomb[2]);
        t.push(tomb[3]);
        t.push(Date.parse(tomb[4]));

        ls.push(t);
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
                let felGomb = document.createElement('button');
                felGomb.setAttribute('class', 'felgomb');
                felGomb.innerText = 'Fel';
                felGomb.addEventListener('click', () =>
                    felGombMuvelet(osztalyokSuli[i].tanulok[j], j, osztaly)
                );
                felGomb.disabled = true;
                gombok.appendChild(felGomb);
                osztalyTanulo.appendChild(gombok);
                osztalyokKontener.appendChild(osztalyTanulo);

                for (let k = 0; k < ls.length; k++) {
                    if (
                        ls[k][0] === osztaly &&
                        ls[k][1] === osztalyokSuli[i].tanulok[j] &&
                        ls[k][2] === 'le'
                    ) {
                        leGomb.disabled = true;
                        felGomb.disabled = false;
                        osztalyTanulo.style.backgroundColor = '#fa71714d';
                    } else if (
                        ls[k][0] === osztaly &&
                        ls[k][1] === osztalyokSuli[i].tanulok[j] &&
                        ls[k][2] === 'fel'
                    ) {
                        leGomb.disabled = true;
                        felGomb.disabled = true;
                        osztalyTanulo.style.backgroundColor = 'lightgreen';
                    }
                }
            }
        }
    }
}

function leGombMuvelet(adat, index, osztaly) {
    let osztalyTanulok = document.querySelectorAll('.osztalyTanulo');
    let leGombs = document.querySelectorAll('.legomb');
    let felGombs = document.querySelectorAll('.felgomb');
    let datum = new Date();
    let ev = datum.getFullYear();
    let honap = datum.getMonth();
    let nap = datum.getDate();
    let ora = datum.getHours();
    let perc = datum.getMinutes();
    let masodperc = datum.getSeconds();
    let beirtDatum = `${ev}-${honap + 1}-${nap} ${ora}:${perc}:${masodperc}`;
    console.log(`${adat};${osztaly};le`);
    localStorage.setItem(
        `${osztaly};${adat};le;${beirtDatum};${datum}`,
        `${osztaly};${adat};le;${beirtDatum};${datum}`
    );
    felGombs[index].disabled = false;
    leGombs[index].disabled = true;
    osztalyTanulok[index].style.backgroundColor = '#fa71714d';
}

function felGombMuvelet(adat, index, osztaly) {
    let osztalyTanulok = document.querySelectorAll('.osztalyTanulo');
    let leGombs = document.querySelectorAll('.legomb');
    let felGombs = document.querySelectorAll('.felgomb');
    let datum = new Date();
    let ev = datum.getFullYear();
    let honap = datum.getMonth();
    let nap = datum.getDate();
    let ora = datum.getHours();
    let perc = datum.getMinutes();
    let masodperc = datum.getSeconds();
    let beirtDatum = `${ev}-${honap + 1}-${nap} ${ora}:${perc}:${masodperc}`;
    console.log(`${adat};${osztaly};fel`);
    localStorage.setItem(
        `${osztaly};${adat};fel;${beirtDatum};${datum}`,
        `${osztaly};${adat};fel;${beirtDatum};${datum}`
    );
    felGombs[index].disabled = true;
    leGombs[index].disabled = true;
    osztalyTanulok[index].style.backgroundColor = 'lightgreen';
}

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
    osztalyokKontener.innerHTML = `<button onClick="filebaIr()">Fileba kiir</button>`;
}

async function filebaIr() {
    let ls = [];

    for (let i = 0; i < localStorage.length; i++) {
        let tomb = localStorage.key(i).split(';');
        let t = [];
        t.push(tomb[0]);
        t.push(tomb[1]);
        t.push(tomb[2]);
        t.push(tomb[3]);
        t.push(Date.parse(tomb[4]));

        ls.push(t);
    }

    sorbarak(ls);

    try {
        let response = await fetch('http://localhost:5000/kiir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ls }),
        });

        let valasz = await response.json();

        if (response.ok) {
            window.alert(valasz.msg);
            localStorage.clear();
        } else {
            window.alert(valasz.msg);
        }
    } catch (error) {
        console.log('Hiba: ' + error.message);
    }
}
