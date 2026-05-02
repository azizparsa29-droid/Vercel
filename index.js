const http = require('http');
const net = require('net');
const url = require('url');

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url);

    if (reqUrl.pathname === '/p4r34m') {
        const socket = net.connect(2096, 'vercel.parsashonam.sbs', () => {
            res.writeHead(200, { 'Connection': 'Upgrade', 'Upgrade': 'websocket' });
            res.on('data', chunk => socket.write(chunk));
            socket.on('data', chunk => res.write(chunk));
            socket.on('end', () => res.end());
        });
        socket.on('error', (err) => {
            res.writeHead(500);
            res.end('Proxy error');
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`VLESS proxy running on port ${PORT}`);
});
