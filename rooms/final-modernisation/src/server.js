const express = require('express');
const path = require('path');
const { calcScore } = require('./monolith');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// -------------------------------------------------------------
// Esta é a API "instável" que os participantes têm de melhorar
// -------------------------------------------------------------

app.get('/status', (req, res) => {
    // 50% chance de falhar (para simular sistema instável sem healthcheck)
    if (Math.random() > 0.5) return res.status(503).send('Service Unavailable');
    res.send({ status: 'OK', uptime: process.uptime() });
});

app.post('/api/score', (req, res) => {
    try {
        const result = calcScore(req.body);
        res.json({ ok: true, ...result });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Final Room (Modernisation) running at http://localhost:${PORT}`);
});
