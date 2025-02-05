async function leGombMuvelet(adat, index, osztaly) {
    let osztalyTanulok = document.querySelectorAll('.osztalyTanulo');
    let leGombs = document.querySelectorAll('.legomb');
    let leSzovegs = document.querySelectorAll('.leszoveg');
    let felGombs = document.querySelectorAll('.felgomb');
    let datum = new Date();
    let ev = datum.getFullYear();
    let honap = datum.getMonth();
    let nap = datum.getDate();
    let ora = datum.getHours();
    let perc = datum.getMinutes();
    let masodperc = datum.getSeconds();
    let beirtDatum = `${ev}-${honap + 1}-${nap} ${ora}:${perc}:${masodperc}`;

    localStorage.setItem(
        `${osztaly};${adat};le;${beirtDatum};${datum}`,
        `${osztaly};${adat};le;${beirtDatum};${datum}`
    );
    leSzovegs[index].innerText = beirtDatum;
    felGombs[index].disabled = false;
    leGombs[index].disabled = true;
    osztalyTanulok[index].style.backgroundColor = '#fa71714d';

    try {
        let szoveg = `${osztaly};${adat};le;${beirtDatum};${datum}`;
        let response = await fetch(`http://localhost:5000/feliras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ szoveg }),
        });

        let valasz = await response.json();

        if (response.ok) {
            console.log(valasz.msg);
        } else {
            console.log(valasz.msg);
        }
    } catch (error) {
        console.log(error.message);
    }
}
