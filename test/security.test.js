const test = require('node:test');
const assert = require('node:assert/strict');
const { withServer } = require('./helpers');

test('user HTML is rendered as text while the greeting markup is preserved', () => withServer(async (base) => {
  // Passive markup is sufficient to detect the unsafe HTML output boundary.
  const name = '<b>CLASSROOM_MARKER</b>&';
  const response = await fetch(`${base}/greeting?name=${encodeURIComponent(name)}`);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/html\b/);
  assert.ok(body.startsWith('<h1>Hello, '));
  assert.ok(body.endsWith('</h1>'));
  assert.ok(!body.includes('<b>'), 'Untrusted input must not become an HTML element');
  assert.match(body, /(?:&lt;|&#0*60;|&#x0*3c;)b(?:&gt;|&#0*62;|&#x0*3e;)/i);
  assert.ok(body.includes('CLASSROOM_MARKER'));
  assert.ok(body.includes('&amp;'), 'The input ampersand must be escaped');
}));

test('preview renders user HTML as text inside its paragraph', () => withServer(async (base) => {
  const message = '<b>PREVIEW_MARKER</b>&';
  const response = await fetch(`${base}/preview?message=${encodeURIComponent(message)}`);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/html\b/);
  assert.ok(body.startsWith('<p>'));
  assert.ok(body.endsWith('</p>'));
  assert.ok(!body.includes('<b>'), 'Untrusted preview input must not become an HTML element');
  assert.match(body, /(?:&lt;|&#0*60;|&#x0*3c;)b(?:&gt;|&#0*62;|&#x0*3e;)/i);
  assert.ok(body.includes('PREVIEW_MARKER'));
  assert.ok(body.includes('&amp;'));
}));
