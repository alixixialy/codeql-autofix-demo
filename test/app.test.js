const test = require('node:test');
const assert = require('node:assert/strict');
const { withServer } = require('./helpers');

test('health check returns ok', () => withServer(async (base) => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
}));

test('ordinary names remain visible in an HTML greeting', () => withServer(async (base) => {
  const response = await fetch(`${base}/greeting?name=Alice`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/html\b/);
  assert.equal(await response.text(), '<h1>Hello, Alice</h1>');
}));

test('missing name keeps the default greeting', () => withServer(async (base) => {
  const response = await fetch(`${base}/greeting`);
  assert.equal(await response.text(), '<h1>Hello, World</h1>');
}));

test('preview retains its ordinary text and paragraph markup', () => withServer(async (base) => {
  const response = await fetch(`${base}/preview?message=Classroom`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<p>Classroom</p>');
}));
