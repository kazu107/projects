'use strict';
const http = require('http');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const fs = require('fs');
const languages = require('./judge/languages.js');
const path = require('path');
const { PythonShell } = require('python-shell');
const { exec, spawn} = require('child_process');
const {performance} = require("perf_hooks");
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

    socket.on('run', async (code, id, isLogin, username, language) => {
        console.log('Code received: ', code);
        //ファイルにコードを書き込む
        try {
            await fs.promises.writeFile(`judge\\langFile\\main.${language}`, code);  // fs.writeFile を Promise に変更
            const fileName = `${id}-testcase.js`;
            const fullPath = require.resolve(`${__dirname}/public/testcase/${fileName}`);
            const problemCases = require(fullPath);
            const judgeway = problemCases.judge;
            const { judge, ...cases } = problemCases;
            console.log('Cases loaded:', cases);
            socket.emit('clearTable');
            //プログレスバーの初期化
            socket.emit('progress', "init", Object.keys(cases).length);

            let ACcount = 0, allCount = 0, maxTime = 0;
            for (const key in cases) {
                if (cases.hasOwnProperty(key)) {
                    let caseData = cases[key];
                    console.log("--sending to processInputs--");
                    console.log("case: ", key);
                    console.log(language);
                    if (!languages[language]) {
                        console.error('Unsupported language. Please specify one of the following: python, cpp, node, ruby, java, perl, php');
                        socket.emit('error', 'Unsupported language');
                        return;
                    }

                    // 入力をファイルに書き込む
                    const inputFilePath = 'judge\\input.txt';
                    const inputData = caseData.input;
                    fs.writeFileSync('./judge/Eoutput.txt', caseData.output);
                    let outputData;
                    let ans;
                    await new Promise((resolve, reject) => {
                        fs.writeFile(inputFilePath, inputData, async (err) => {
                            if (err) {
                                console.error(`Error writing file: ${err.message}`);
                                socket.emit('error', 'Error writing input file');
                                reject(err);
                                return;
                            }
                            const langConfig = languages[language];
                            if (langConfig.needsCompilation) {
                                ans = await compileAndRun(langConfig, inputFilePath, socket);
                            } else {
                                ans = await run(langConfig, inputFilePath, socket);
                            }
                            outputData = fs.readFileSync('./judge/output.txt').toString();
                            resolve();
                        });
                    });
                    console.log(ans);

                    const times = ans.executionTime;
                    if (times > maxTime) {
                        maxTime = times;
                    }
                    console.log("-----------------------------------");
                    console.log("actual output  : ", outputData);
                    console.log("expected output: ", caseData.output);
                    console.log("-----------------------------------");
                    //console.log("--send to client--\n", "case: "+ result[0] + "\n" , result[1] + " and " + result[2] + "  time: ", times + " ms");
                    if (judgeway === "normal") {
                        if (times > 4000) {
                            socket.emit('result', key, "TLE", times + " ms");
                        }
                        else if (caseData.input === undefined || outputData === undefined) {
                            socket.emit('result', key, "RE", times + " ms");
                        }
                        else if (caseData.output.toString() === outputData.toString()) {
                            ACcount++;
                            socket.emit('result', key, "AC", times + " ms");
                        }
                        else {
                            socket.emit('result', key, "WA", times + " ms");
                        }
                    }
                    else if (judgeway === "decimal") {
                        const numExpected = parseFloat(caseData.output);
                        const numActual = parseFloat(outputData);
                        if (times > 4000) {
                            socket.emit('result', key, "TLE", times + " ms");
                        }
                        else if (caseData.input === undefined || outputData === undefined) {
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
                    'INSERT INTO usersolvedproblems (user_id, problem_id, is_correct, source_code, execute_time) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                    [user, probID, check, code, maxTime]
                );
                console.log("result: ", result.rows[0].id);
            }
        } catch (error) {
            console.error("Error processing inputs or loading cases:", error);
            socket.emit('result', `Error: ${error.message}`);
        }
    });
    //メインページの最近の解答を取得
    socket.on('search', async (searchUser, stats, amount) => {
        console.log("received search request: ", searchUser, " ", stats, " ", amount, " 件取得します。");
        const isAC = stats === "ac";
        if (searchUser === "") {
            if (stats === "all") {
                const result = await pool.query(
                    `
                        with main as (select solved_date,
                                             (select username
                                              from users
                                              where users.id = user_id)       as users,
                                             (select problem_description
                                              from problems
                                              where problems.id = problem_id) as probs,
                                             is_correct,
                                             execute_time,
                                             source_code
                                      from usersolvedproblems
                                      order by solved_date desc)
                        select *
                        from main
                        limit $1
    `,
                    [amount]
                );
                console.log("---search result no name---\n", result.rows);
                socket.emit('searchResult', result.rows);
            }
            else {
                const result = await pool.query(
                    `
                        with main as (select solved_date,
                                             (select username
                                              from users
                                              where users.id = user_id)       as users,
                                             (select problem_description
                                              from problems
                                              where problems.id = problem_id) as probs,
                                             is_correct,
                                             execute_time,
                                             source_code
                                      from usersolvedproblems
                                      order by solved_date desc)
                        select *
                        from main
                        where is_correct = $1
                        limit $2
    `,
                    [isAC, amount]
                );
                console.log("---search result no name---\n", result.rows);
                socket.emit('searchResult', result.rows);
            }
        }
        else {
            if (stats === "all") {
                const result = await pool.query(
                    `
                        with main as (select solved_date,
                                             (select username
                                              from users
                                              where users.id = user_id)       as users,
                                             (select problem_description
                                              from problems
                                              where problems.id = problem_id) as probs,
                                             is_correct,
                                             execute_time,
                                             source_code
                                      from usersolvedproblems
                                      order by solved_date desc)
                        select *
                        from main
                        where users = $1
                        limit $2
    `,
                    [searchUser, amount]
                );
                console.log("---search result---\n", result.rows);
                socket.emit('searchResult', result.rows);
            }
            else {
                const result = await pool.query(
                    `
                        with main as (select solved_date,
                                             (select username
                                              from users
                                              where users.id = user_id)       as users,
                                             (select problem_description
                                              from problems
                                              where problems.id = problem_id) as probs,
                                             is_correct,
                                             execute_time,
                                             source_code
                                      from usersolvedproblems
                                      order by solved_date desc)
                        select *
                        from main
                        where users = $1
                          and $2 = true limit $3
    `,
                    [searchUser, isAC, amount]
                );
                console.log("---search result---\n", result.rows);
                socket.emit('searchResult', result.rows);
            }
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

function compileAndRun(langConfig, inputFilePath, socket) {
    return new Promise((resolve, reject) => {
        const compileArgs = langConfig.args(langConfig.scriptPath);
        const compileProcess = spawn(langConfig.compiler, compileArgs);

        compileProcess.stderr.on('data', (data) => {
            console.error(`Compile stderr: ${data}`);
            socket.emit('error', data.toString());
        });

        compileProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Compilation process exited with code ${code}`);
                socket.emit('error', `Compilation process exited with code ${code}`);
                return;
            }

            console.log('Compilation successful');
            const executablePath = langConfig.scriptPath.replace(/\.(cpp|java|c|rs|kt|cs|go)$/, '');
            const runArgs = langConfig.command ? langConfig.args(executablePath) : [];
            const runProcess = langConfig.command ? spawn(langConfig.command, runArgs) : spawn(executablePath);

            resolve(handleProcessOutput(runProcess, inputFilePath, langConfig.scriptPath, socket));
        });
    });

}

function run(langConfig, inputFilePath, socket) {
    const runArgs = langConfig.args(langConfig.scriptPath);
    const runProcess = spawn(langConfig.command, runArgs);

    return handleProcessOutput(runProcess, inputFilePath, langConfig.scriptPath, socket);
}

function handleProcessOutput(process, inputFilePath, scriptPath, socket) {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();

        process.stdin.write(fs.readFileSync(inputFilePath));
        process.stdin.end();

        let outputData = '';
        let errorData = '';

        process.stdout.on('data', (data) => {
            console.log(`Script output:\n${data}`);
            outputData += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            errorData += data.toString();
        });

        const getMemoryUsage = (pid) => {
            return new Promise((resolve, reject) => {
                pidusage(pid, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stats.memory);
                    }
                });
            });
        };

        let maxMemoryUsage = 0;
        const intervalId = setInterval(async () => {
            try {
                const memoryUsage = await getMemoryUsage(process.pid);
                if (memoryUsage > maxMemoryUsage) {
                    maxMemoryUsage = memoryUsage;
                }
            } catch (err) {
                console.error(`Error getting memory usage (You can ignore this error message): ${err.message}`);
                clearInterval(intervalId);
            }
        }, 50);

        process.on('close', async (code) => {
            clearInterval(intervalId);
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            try {
                const fileSize = fs.statSync(scriptPath).size;
                outputData = outputData.replace(/\r/g, '');
                errorData = errorData.replace(/\r/g, '');
                fs.writeFileSync('./judge/output.txt', outputData);
                const result = {
                    output: outputData,
                    error: errorData,
                    maxMemoryUsage: `${(maxMemoryUsage / 1024).toFixed(0)}`,//kb
                    executionTime: `${executionTime.toFixed(0)}`,//ms
                    fileSize: `${fileSize}`//bytes
                };

                //socket.emit('result', result);
                resolve(result);
            } catch (err) {
                console.error(`Error getting stats: ${err.message}`);
                socket.emit('error', 'Error getting file stats');
                reject(err);
            }

            if (code !== 0) {
                console.error(`Process exited with code ${code}`);
            } else {
                console.log('Process executed successfully');
            }
        });
    });
}