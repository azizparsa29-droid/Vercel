const http = require('http');

const TARGET = process.env.TARGET_DOMAIN || 'vercel.passshonan.sbs:2096';

const server = http.createServer((req, res) => {
    const options = {
        hostname: TARGET.split(':')[0],
        port: TARGET.split(':')[1] || 80,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxy = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
    proxy.on('error', (err) => {
        res.writeHead(500);
        res.end('Tunnel error: ' + err.message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Tunnel running on port ${PORT} -> ${TARGET}`);
});
