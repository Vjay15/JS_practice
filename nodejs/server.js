const http = require('http');
const fs = require('fs');
const path = require("path");
const math = require('./math');
const querystring = require('querystring');

const server = http.createServer((req,res) => {
    console.log(req.headers);
    // GET /
    if (req.method==='GET' && req.url=="/"){
        const filePath = path.join(__dirname,'index.html');
        res.writeHead(200, {'Content-Type':'text/html'});
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    // GET /download
    if (req.method==='GET' && req.url=="/download"){
        const filePath = path.join(__dirname,'test.txt');
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="sample.txt"'
        });

        fs.createReadStream(filePath).pipe(res);
        return;
    }

    // POST /calculate
    if (req.method==='POST' && req.url=="/calculate"){
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            console.log(body);
            const parsed = querystring.parse(body);
            const a = +parsed.a;
            const b = +parsed.b;
            const operation = parsed.operation;
            let result;
            try {
                switch (operation){
                    case 'add':
                        result = math.add(a,b);
                        break;
                    case 'sub':
                        result = math.sub(a,b);
                        break;
                    case 'mul':
                        result = math.mul(a,b);
                        break;
                    case 'div':
                        result = math.div(a,b);
                        break;
                    default:
                        throw new Error("Invalid operation")
                }
                res.writeHead(200,{'Content-Type':'text/html'})
                res.end(`
                    <script>
                    alert('result is ${result}');
                    window.location.href="/";
                    </script>
                    `);
                }
                catch (err) {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
                      <h1>Error</h1>
                      <p>${err.message}</p>
                      <a href="/">Back</a>
                    `);
                  }
                });
            
                return;
              }
            
    /* ----------- 404 fallback ----------- */
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

/* ---------------------------------------------
   Start server
---------------------------------------------- */

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
