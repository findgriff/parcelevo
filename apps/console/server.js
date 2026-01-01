/* apps/console/server.js */
const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = false;
const app = next({ dev, hostname: '0.0.0.0', port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Console ready on :${port}`);
  });
});
