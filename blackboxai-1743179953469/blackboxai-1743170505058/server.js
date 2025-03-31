const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Store next outcome in memory
let nextOutcome = null;

// Initialize log file
const LOG_FILE = path.join(__dirname, 'spin_log.txt');
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '');
}

// Serve static files
app.use(express.static(__dirname));

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve control panel
app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'control.html'));
});

// Get next outcome
app.get('/next-outcome', (req, res) => {
    res.json({ outcome: nextOutcome });
    nextOutcome = null; // Reset after sending
});

// Set next outcome (from control panel)
app.post('/rig', (req, res) => {
    const { outcome } = req.body;
    if (outcome === 'dark' || outcome === 'light') {
        nextOutcome = outcome;
        res.json({ success: true, message: `Next spin will be ${outcome.toUpperCase()}` });
    } else {
        res.status(400).json({ success: false, message: 'Invalid outcome' });
    }
});

// Log endpoint
app.post('/log', (req, res) => {
    const result = req.body.result;
    const logData = `${result}\n`;
    
    fs.appendFile(LOG_FILE, logData, (err) => {
        if (err) {
            console.error('Log write error:', err);
            return res.status(500).json({error: 'Logging system error'});
        }
        res.sendStatus(200);
    });
});

// Get logs endpoint
app.get('/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log:', err);
            return res.json({logs: []});
        }
        const lines = data.trim().split('\n')
            .filter(line => {
                const cleanLine = line.trim();
                return cleanLine === 'LIGHT' || cleanLine === 'DARK';
            })
            .reverse()
            .slice(0, 5)
            .map(line => line.trim());
        
        const logs = lines.map(JSON.stringify);
        res.json({logs: JSON.parse(`[${logs.join(',')}]`)});
    });
});

// Start server
const port = 8000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Control panel at http://localhost:${port}/control`);
});