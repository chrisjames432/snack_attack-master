const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🎮 Snack Attack Game Server is running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from the 'public' directory`);
    console.log(`🚀 Open your browser and navigate to http://localhost:${PORT} to play!`);
});
