// Reviewed teaching fixes. The vulnerable baseline is preserved on main.
const express = require('express');
const escape = require('escape-html');
const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/greeting', (req, res) => {
  const name = escape(String(req.query.name || 'World'));
  res.send('<h1>Hello, ' + name + '</h1>');
});

app.get('/preview', (req, res) => {
  const message = escape(String(req.query.message || ''));
  res.send('<p>' + message + '</p>');
});

module.exports = app;
