const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Route utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server berjalan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
