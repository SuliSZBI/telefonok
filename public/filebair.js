async function filebaIr() {
    let ls = [];

    try {
        const response = await fetch(`http://localhost:5000/beolvas`);

        const valasz = await response.json();

        if (response.ok) {
            let valaszLista = valasz.lista;
            let tombLista = valaszLista.split('\n');

            for (let i = 0; i < tombLista.length; i++) {
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
        console.log('Hiba: ' + error.message);
    }

    sorbarak(ls);

    try {
        let response = await fetch(`http://localhost:5000/kiir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ls }),
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
