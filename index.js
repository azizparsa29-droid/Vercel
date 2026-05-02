const http = require('http');

const TARGET = process.env.TARGET_DOMAIN || '46.224.188.137:2996';
const TARGET_HOST = TARGET.split(':')[0];
const TARGET_PORT = parseInt(TARGET.split(':')[1]) || 80;

const server = http.createServer((req, res) => {
    const options = {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
    proxyReq.on('error', (err) => {
        res.writeHead(500);
        res.end('Proxy error: ' + err.message);
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy running on port ${PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
