const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Rota principal para servir o HTML
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
