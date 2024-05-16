'use strict';
const http = require('http');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
//const server = http.createServer(index);
//const io = require('socket.io')(index);
const defaultPythonPath = `${__dirname}/Python/Python311/python.exe`;
const heroku_pythonPath = 'python';
const options = {
    mode: 'text',
    //pythonPath: heroku_pythonPath,
    pythonPath: defaultPythonPath,
    pythonOptions: ['-u'], // コマンドラインオプション
    scriptPath: __dirname, // スクリプトのディレクトリ指定
    stderrParser: (log) => { return log; },
    stdoutParser: (log) => { return log; }
    //args: [code]
};

const SECRET_KEY = process.env.SECRET_KEY;

const port = process.env.PORT || 5001;
const index = express()
    .use(express.static('public'))
    .use(express.json())
    // ユーザー登録
    .post('/register', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const passwordHash = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
                [username, email, passwordHash]
            );
            res.status(201).json({ userId: result.rows[0].id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    // ログイン
    .post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            if (user && await bcrypt.compare(password, user.password_hash)) {
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'register.html'));
    })
    .get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    })
    .get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    })
    .listen(port, () => console.log(`Listening on http://localhost:${ port }`))

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const io = require('socket.io')(index);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('run', async (code, id) => {
        console.log('Code received: ', code);
        // ファイルにコードを書き込む
        try {
            await fs.promises.writeFile('sample.py', code);  // fs.writeFile を Promise に変更
            const fileName = `${id}-testcase.js`;
            const fullPath = require.resolve(`${__dirname}/public/testcase/${fileName}`);
            const problemCases = require(fullPath);
            const judgeway = problemCases.judge;
            const { judge, ...cases } = problemCases;

            console.log('Cases loaded:', cases);
            socket.emit('clearTable');

            for (const key in cases) {
                if (cases.hasOwnProperty(key)) {
                    let caseData = cases[key];
                    let result = await processInputs([key, caseData.input, caseData.output]);
                    const times = parseInt(result[3]);
                    if (judgeway === "normal") {
                        if (times > 4000) {
                            socket.emit('result', result[0], "TLE", times + " ms");
                        }
                        else if (result[1] === result[2]) {
                            socket.emit('result', result[0], "AC", times + " ms");
                        }
                        else {
                            socket.emit('result', result[0], "WA", times + " ms");
                        }
                    }
                    else if (judgeway === "decimal") {
                        const numExpected = parseFloat(result[2]);
                        const numActual = parseFloat(result[1]);
                        if (times > 4000) {
                            socket.emit('result', result[0], "TLE", times + " ms");
                        }
                        else if (Math.abs(numExpected - numActual) <= 0.0001) {
                            socket.emit('result', result[0], "AC", times + " ms");
                        }
                        else {
                            socket.emit('result', result[0], "WA", times + " ms");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error processing inputs or loading cases:", error);
            socket.emit('result', `Error: ${error.message}`);
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Pythonスクリプトを実行し、入力を送り、結果を受け取る関数
function runPythonScript(input, timeoutMs = 5000) {
    const startTime = require('perf_hooks').performance.now();
    let timeoutHandle;
    let isTimeout = false;

    return new Promise((resolve, reject) => {
        const pyshell = new PythonShell('sample.py', options);
        let output = '';  // 出力を格納する文字列

        pyshell.send(input);

        pyshell.on('message', function(message) {
            if (!isTimeout) {  // タイムアウト後のメッセージは無視
                output += message + `\n`;
            }
        });

        // タイムアウトハンドラの設定
        timeoutHandle = setTimeout(() => {
            isTimeout = true;
            pyshell.terminate();  // Pythonスクリプトの実行を終了
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            resolve(["error", executionTime]);  // エラーメッセージと実行時間を返す
        }, timeoutMs);

        pyshell.end(function (err) {
            clearTimeout(timeoutHandle);  // タイムアウトタイマーをクリア
            const endTime = require('perf_hooks').performance.now();  // 高精度な終了時刻を記録
            const executionTime = endTime - startTime;  // 実行時間を計算
            if (err) {
                if (!isTimeout) {  // 通常のエラー
                    console.error('Error finishing Python script:', err);
                    reject(err);
                }  // タイムアウトが発生していたらすでに resolve しているので何もしない
            } else {
                if (!isTimeout) {  // タイムアウトしていない正常終了
                    console.log(`Python script finished`);
                    resolve([output, executionTime]);
                }
            }
        });
        pyshell.on('error', function(err) {
            clearTimeout(timeoutHandle);  // タイムアウトタイマーをクリア
            console.error('Error from Python script:', err);
            reject(err);
        });
    });
}


// 入力ごとにPythonスクリプトを実行する関数
async function processInputs(info) {
    let datas = [];
    try {
        const output = await runPythonScript(info[1]);
        console.log(`Processing\n${info[1]}`);
        console.log(`expected Output is:`, info[2]);
        console.log('actual Output is  :', output[0]);
        datas = [info[0], output[0], info[2], output[1]];
        //datas.push([info[0], output[0], info[2], output[1]]);

        // 通常の判定方法

        if (output[0] === info[2]) {
            console.log(`${info[0]} passed`, "\n");
        } else {
            console.log(`${info[0]} failed`, "\n");
        }
    } catch (err) {
        console.error(`Error processing ${info[1]}:`, err);
    }
    return datas;
}