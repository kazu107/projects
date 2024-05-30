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
    /*
    デプロイするときは絶対に書き換える！！！！！
    デプロイするときは絶対に書き換える！！！！！
    デプロイするときは絶対に書き換える！！！！！
     */
    pythonPath: heroku_pythonPath,
    //pythonPath: defaultPythonPath,
    /*
    デプロイするときは絶対に書き換える！！！！！
    デプロイするときは絶対に書き換える！！！！！
    デプロイするときは絶対に書き換える！！！！！
     */
    pythonOptions: ['-u'], // コマンドラインオプション
    scriptPath: __dirname, // スクリプトのディレクトリ指定
    stderrParser: (log) => { return log; },
    stdoutParser: (log) => { return log; }
    //args: [code]
};

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// 認証ミドルウェア
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// トークンリフレッシュ用ミドルウェア
function refreshToken(req, res, next) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '7d' });
        const newRefreshToken = jwt.sign({ userId: user.userId }, REFRESH_SECRET_KEY, { expiresIn: '30d' });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
}

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
                const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });
                const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET_KEY, { expiresIn: '30d' });
                res.json({ accessToken, refreshToken });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post('/refresh', refreshToken, (req, res) => {
        const { userId } = req.user;
        const newAccessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' });
        const newRefreshToken = jwt.sign({ userId }, REFRESH_SECRET_KEY, { expiresIn: '30d' });
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    })
    /*
    .post('/refresh-token', (req, res) => {
        const { token } = req.body;
        if (!token) return res.sendStatus(401);
        jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ accessToken });
        });
    })
    */
    .get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'register.html'));
    })
    .get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    })
    .get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    })
    // ダッシュボード (認証が必要)
    .get('/dashboard', authenticateToken, async (req, res) => {
        try {
            const result = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.userId]);
            const user = result.rows[0];
            if (user) {
                res.json({ username: user.username });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    // プロフィール情報 (認証が必要)
    .get('/profile', authenticateToken, async (req, res) => {
        try {
            const result = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.userId]);
            const user = result.rows[0];
            if (user) {
                res.json({ username: user.username });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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

    socket.on('run', async (code, id, isLogin, username) => {
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
            //プログレスバーの初期化
            socket.emit('progress', "init", Object.keys(cases).length);

            let ACcount = 0, allCount = 0;
            for (const key in cases) {
                if (cases.hasOwnProperty(key)) {
                    let caseData = cases[key];
                    console.log("--sending to processInputs--");
                    console.log("case: ", key);
                    let result = await processInputs([key, caseData.input, caseData.output]);
                    const times = parseInt(result[3]);
                    console.log("--send to client--\n", "case: "+ result[0] + "\n" , result[1] + " and " + result[2] + "  time: ", times + " ms");
                    if (judgeway === "normal") {
                        if (times > 4000) {
                            socket.emit('result', key, "TLE", times + " ms");
                        }
                        else if (result[1] === undefined || result[1] === undefined) {
                            socket.emit('result', key, "RE", times + " ms");
                        }
                        else if (result[1] === result[2]) {
                            ACcount++;
                            socket.emit('result', key, "AC", times + " ms");
                        }
                        else {
                            socket.emit('result', key, "WA", times + " ms");
                        }
                    }
                    else if (judgeway === "decimal") {
                        const numExpected = parseFloat(result[2]);
                        const numActual = parseFloat(result[1]);
                        if (times > 4000) {
                            socket.emit('result', key, "TLE", times + " ms");
                        }
                        else if (result[1] === undefined || result[1] === undefined) {
                            socket.emit('result', key, "RE", times + " ms");
                        }
                        else if (Math.abs(numExpected - numActual) <= 0.0001) {
                            ACcount++;
                            socket.emit('result', key, "AC", times + " ms");
                        }
                        else {
                            socket.emit('result', key, "WA", times + " ms");
                        }
                    }
                    allCount++;
                    socket.emit('progress', "next", Object.keys(cases).length);
                }
            }
            if (isLogin) {
                console.log("username: ", username + " さんの解答をデータベースに保存します。");
                const userid = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
                const user = userid.rows[0].id;
                console.log("user id: ", user, " を取得");
                let chap, num;
                const tempID = id;
                //0章の問題の場合
                if (tempID.length > 4) {
                    chap = 0;
                    //idの最後の文字を整数に変換
                    num = parseInt(tempID.slice(-1));
                }
                else {
                    chap = tempID[1];
                    num = parseInt(tempID.slice(-1));
                }
                console.log("chapter: ", chap, " problem number: ", num, " を取得");
                const problem = await pool.query('SELECT id FROM problems WHERE chapter_id = $1 and problem_number = $2', [chap, num]);
                const probID = problem.rows[0].id;
                let check;
                check = ACcount === Object.keys(cases).length;
                const result = await pool.query(
                    'INSERT INTO usersolvedproblems (user_id, problem_id, is_correct, source_code) VALUES ($1, $2, $3, $4) RETURNING id',
                    [user, probID, check, code]
                );
                console.log("result: ", result.rows[0].id);
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
    console.log("--send back to judge from processInputs--");
    console.log("case: ", datas[0] + "\n", datas[1] + " and " + datas[2] + "  time: ", datas[3] + " ms");
    return datas;
}
