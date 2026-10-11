const { once } = require('node:events');
const app = require('../src/app');

async function withServer(check) {
  const server = app.listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    await check(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  }
}

module.exports = { withServer };
