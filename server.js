const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

let weddingData = {};

try {
    if (fs.existsSync(DATA_FILE)) {
        weddingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        console.log('Loaded existing data from file.');
    }
} catch (e) {
    console.log('No existing data file, starting fresh.');
}

app.get('/api/data', (req, res) => {
    res.json(weddingData);
});

app.post('/api/data', (req, res) => {
    weddingData = req.body;
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(weddingData));
    } catch (e) {
        console.error('Failed to write data file:', e.message);
    }
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Wedding tracker running on port ${PORT}`);
});
