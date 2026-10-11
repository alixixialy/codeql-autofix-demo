// Intentionally vulnerable teaching example. No public server is started.
const express = require('express');
const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/greeting', (req, res) => {
  const name = String(req.query.name || 'World');
  res.send('<h1>Hello, ' + name + '</h1>');
});

module.exports = app;
