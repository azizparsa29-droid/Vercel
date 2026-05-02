const http = require('http');
const https = require('https');
const url = require('url');

const TARGET = process.env.TARGET_DOMAIN || 'vercel.parsashonam.sbs:2096';
const TARGET_HOST = TARGET.split(':')[0];
const TARGET_PORT = TARGET.split(':')[1] || 443;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);
    
    const options = {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: reqUrl.path,
        method: req.method,
        headers: req.headers
    };
    
    const proxy = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });
    
    req.pipe(proxy);
    proxy.on('error', (e) => {
        res.writeHead(500);
        res.end('Proxy error');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy running on ${PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
