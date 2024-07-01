const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
// Route is used for Refractor nodes to send heartbeat to RDP
// Generated Refractor will also communicate with RDP via JWT

router.post('/', (req, res) => {
    // TODO
});

router.post('/heartbeat', (req, res) => {

});

router.get('/updates', (req, res) => {
    // TODO: bundle updates as JSON file and send it to Refractor
});

router.get('/node_status', (req, res) => {
    const exampleData = {
        "owner_id": "user123",
        "refractor_status": {
            "status": "online",
            "last_updated": "2023-06-29T14:30:00Z"
        },
        "total_workflows": 23,
        "rfts_minted": 1045,
        "triggers": 78,
        "crypto_balance": {
            "usdc": {
                "balance": 321.23,
                "wallet_address": "0x1234567890123456789012345678901234567890"
            },
            "base": {
                "balance": 433.23,
                "wallet_address": "0x0987654321098765432109876543210987654321"
            }
        },
    };
    res.json(exampleData);
});


router.get('/download-refractor', (req, res) => {
    const filePath = path.join(__dirname, '../main.js');

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist:", err);
            return res.status(404).send({
                message: "File not found"
            });
        }

        // Get the original filename
        const fileName = path.basename(filePath);

        // Set headers
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error("Error streaming file:", err);
            res.status(500).send({
                message: "Error occurred while downloading the file."
            });
        });

        fileStream.on('close', () => {
            console.log('File download completed');
        });
    });
});


module.exports = router;


module.exports = router;