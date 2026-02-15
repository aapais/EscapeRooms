'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Legacy monolith I/O logic simulation
const { calcScore } = require('../../src/monolith');

app.get('/health', (req, res) => {
    // Challenge: This endpoint might not exist or be "down" initially
    // or requires implementing properly in the monolith.js
    res.json({ status: 'UP', uptime: process.uptime() });
});

app.post('/api/score', (req, res) => {
    const profile = req.body;
    try {
        const result = calcScore(profile);
        res.json({ ok: true, ...result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Final Room Visual Server running at http://localhost:${PORT}`);
});
