require('dotenv').config();
const path = require('node:path');
const fsPromise = require('node:fs/promises');
const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

cors();

app.get('/', (req, res) => {
    try {
        return res.status(200).sendFile(path.join(__dirname, 'index.html'));
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

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
