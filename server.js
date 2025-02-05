require('dotenv').config();
const path = require('node:path');
const fsPromise = require('node:fs/promises');
const express = require('express');
const schedule = require('node-schedule');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

cors();

const rule1 = new schedule.RecurrenceRule();
rule1.hour = 22;
rule1.minute = 0;

const job1 = schedule.scheduleJob(rule1, function () {
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
                console.log(valasz.msg);
            } else {
                console.log(valasz.msg);
            }
        } catch (error) {
            console.log('Hiba: ' + error.message);
        }
    }

    filebaIr();
});

const rule2 = new schedule.RecurrenceRule();
rule2.hour = 22;
rule2.minute = 30;

const job2 = schedule.scheduleJob(rule2, function () {
    const torol = async () => {
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
                console.log(valasz.msg);
            } else {
                console.log(valasz.msg);
            }
        } catch (error) {
            console.log('Hiba: ' + error.message);
        }
    };

    torol();
});

app.get('/', (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba: ' + error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { nev, jelszo } = req.body;
        const filePath = path.resolve(__dirname, 'public', 'tanarok.txt');

        const adatok = await fsPromise.readFile(filePath, {
            encoding: 'utf-8',
        });

        let tomb = adatok.split('\n');
        const tomb1 = tomb.map((elem) => elem.trim());

        let helyes = tomb1.find((elem) => elem === nev && jelszo === 'telefon');

        if (helyes)
            return res
                .status(200)
                .json({ msg: 'Sikeres belépés!', belep: true });
        else
            return res
                .status(200)
                .json({ msg: 'Nem léphetsz be!', belep: false });
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba: ' + error.message });
    }
});

app.get('/beolvas', async (req, res) => {
    try {
        const filePath = path.resolve(
            __dirname,
            'public',
            'csvfiles',
            `feliras.csv`
        );

        let lista = await fsPromise.readFile(filePath, { encoding: 'utf8' });

        return res.status(200).json({ msg: 'Sikeres beolvasás!', lista });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

app.post('/kiir', async (req, res) => {
    try {
        let tomb = req.body.ls;

        let szoveg = '';
        let datum = new Date();
        let ev = datum.getFullYear();
        let honap = datum.getMonth();
        let nap = datum.getDate();
        let cim = `${ev}-${honap + 1}-${nap}`;
        for (let i = 0; i < tomb.length - 1; i++) {
            for (let j = 0; j < tomb[i].length - 1; j++) {
                if (j < tomb[i].length - 2) {
                    szoveg += `${tomb[i][j]};`;
                } else {
                    szoveg += `${tomb[i][j]}`;
                }
            }
            if (i < tomb.length - 1) {
                szoveg += '\n';
            }
        }

        const filePath = path.resolve(
            __dirname,
            'public',
            'csvfiles',
            `${cim}.csv`
        );
        await fsPromise.writeFile(filePath, szoveg, { encoding: 'utf8' });

        return res.status(201).json({ msg: 'Sikeres mentés' });
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba' + error.message });
    }
});

app.post('/feliras', async (req, res) => {
    try {
        const szoveg = req.body.szoveg + '\n';

        const filePath = path.resolve(
            __dirname,
            'public',
            'csvfiles',
            `feliras.csv`
        );

        await fsPromise.appendFile(filePath, '\ufeff' + szoveg, {
            encoding: 'utf8',
        });

        return res.status(201).json({ msg: 'Sikeres mentés' });
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba' + error.message });
    }
});

app.post('/torol', async (req, res) => {
    try {
        const szoveg = '';

        const filePath = path.resolve(
            __dirname,
            'public',
            'csvfiles',
            `feliras.csv`
        );
        await fsPromise.writeFile(filePath, szoveg, { encoding: 'utf8' });

        return res.status(201).json({ msg: 'Sikeres törlés' });
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba' + error.message });
    }
});

app.use('*', (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, '444.html'));
    } catch (error) {
        return res.status(500).json({ msg: 'Valami hiba: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
