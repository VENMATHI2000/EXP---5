const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Define the server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve the index.html file
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/write' && req.method === 'POST') {
        // Handle POST request to write to the file
        let body = '';

        // Collect data from the POST request
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            // Parse the body to get the content
            const parsedBody = querystring.parse(body);
            const content = parsedBody.content;

            // Write the content to sample.txt
            fs.writeFile(path.join(__dirname, 'sample.txt'), content, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error writing to file');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('File written successfully');
                }
            });
        });
    } else if (req.url === '/read') {
        // Read from the file
        fs.readFile(path.join(__dirname, 'sample.txt'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading the file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`File content: ${data}`);
            }
        });
    } else {
        // Handle 404 - Page not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
