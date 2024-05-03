const http = require('http');
const express = require('express');
const path = require('path');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

// HTMLファイルへのルートを設定
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('run', (code) => {
        console.log('Code received: ', code);

        // セキュリティリスクを減らすための基本的なサニタイズ
        // 実際のアプリケーションではより厳格なチェックが必要
        if (code.match(/import|exec|eval|os\.|sys\./)) {
            socket.emit('result', 'Error: Unsafe code is not allowed.');
            return;
        }

        let options = {
            mode: 'text',
            pythonPath: `${__dirname}/Python/Python311/python.exe`,
            //pythonOptions: ['-c'], // コマンドラインオプション
            scriptPath: __dirname, // スクリプトのディレクトリ指定
            stderrParser: (log) => { return log; },
            stdoutParser: (log) => { return log; }
            //args: [code]
        };
        let escapedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        PythonShell.run(`sample.py`, options, function (err, results) {
            if (err) {
                console.error('Error running Python script:', err);
                socket.emit('result', `Error: ${err.message}`);
                return;
            }
            if (results) {
                console.log('Python execution results:', results);
                socket.emit('result', results.join('\n'));
            }
            else {
                console.log('No results returned from Python script.');
                socket.emit('result', 'No results returned.');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = 3000;
server.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});