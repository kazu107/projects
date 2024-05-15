'use strict';
const http = require('http');
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

const port = process.env.PORT || 5001;
const index = express()
    .use(express.static('public'))
    .get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    })
    .listen(port, () => console.log(`Listening on http://localhost:${ port }`))

const io = require('socket.io')(index);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('run', (code, id) => {
        console.log('Code received: ', code);
        // ファイルにコードを書き込む
        fs.writeFile('sample.py', code, (err) => {
            // セキュリティリスクを減らすための基本的なサニタイズ
            // 実際のアプリケーションではより厳格なチェックが必要
            /*
            if (code.match(/import|exec|eval|os\.|sys\./)) {
                socket.emit('result', 'secError: Unsafe code is not allowed.');
                return;
            }
            */
            if (err) {
                console.error('Error writing code to file:', err);
                socket.emit('result', `writeFileError: ${err.message}`);
                return;
            }
            const fileName = `${id}-testcase.js`;
            let problemCases = "";
            try {
                // ファイルのフルパスを解決
                const fullPath = require.resolve(`${__dirname}/public/testcase/${fileName}`);
                //const fullPath = require.resolve(`/app/test.js`);
                console.log("Full path of the module:", fullPath);

                // モジュールを読み込む
                problemCases = require(fullPath);
                // problemCases を使用した処理をここで行う
            } catch (error) {
                console.error("Error loading the module:", error);
            }
            const judgeway = problemCases.judge;
            const { judge, ...cases } = problemCases;
            let inputs = [];
            let outputs = [];
            // "input" と "output" をそれぞれの配列に追加
            let infos = [];
            for (const key in cases) {
                if (cases.hasOwnProperty(key)) {
                    inputs.push(cases[key].input);
                    outputs.push(cases[key].output);
                    infos.push([key, cases[key].input, cases[key].output]);
                }
            }
            console.log('Inputs:', inputs);
            console.log('Outputs:', outputs);
            // 入力配列に対してプロセスを実行
            socket.emit('clearTable');
            for (const info of infos) {
                const res = processInputs(info);
                res.then((data) => {
                    if (judgeway === "normal") {
                        if (parseInt(data[3]) > 4000) {
                            socket.emit('result', data[0], "TLE", parseInt(data[3]) + " ms");
                        }
                        else if (data[1] === data[2]) {
                            socket.emit('result', data[0], "AC", parseInt(data[3]) + " ms");
                        }
                        else {
                            socket.emit('result', data[0], "WA", parseInt(data[3]) + " ms");
                        }
                    }
                    // 小数点数の判定方法
                    else if (judgeway === "decimal") {
                        const numExpected = parseFloat(data[2]);
                        const numActual = parseFloat(data[1]);
                        if (parseInt(data[3]) > 4000) {
                            socket.emit('result', data[0], "TLE", parseInt(data[3]) + " ms");
                        }
                        else if (numExpected - 0.001 <= numActual && numActual <= numExpected + 0.001) {
                            socket.emit('result', data[0], "AC", parseInt(data[3]) + " ms");
                        }
                        else {
                            socket.emit('result', data[0], "WA", parseInt(data[3]) + " ms");
                        }
                    }
                    console.log(data[0], "AC", parseInt(data[3]) + " ms");
                }).catch((err) => {
                    console.error("Error processing inputs:", err);
                    socket.emit('result', `processInputsError: ${err.message}`);
                });
            }
            //const res = processInputs(infos, judgeway);
            /*
            res.then((data) => {
                console.log("--judge--");
                socket.emit('clearTable');
                for (let i = 0; i < data.length; i++) {
                    // 通常の判定方法
                    if (judgeway === "normal") {
                        if (data[i][1] === data[i][2]) {
                            socket.emit('result', data[i][0], "AC", parseInt(data[i][3]) + " ms");
                        }
                        else {
                            socket.emit('result', data[i][0], "WA", parseInt(data[i][3]) + " ms");
                        }
                    }
                    // 小数点数の判定方法
                    else if (judgeway === "decimal") {
                        const numExpected = parseFloat(data[i][2]);
                        const numActual = parseFloat(data[i][1]);
                        if (numExpected - 0.001 <= numActual && numActual <= numExpected + 0.001) {
                            socket.emit('result', data[i][0], "AC", parseInt(data[i][3]) + " ms");
                        }
                        else {
                            socket.emit('result', data[i][0], "WA", parseInt(data[i][3]) + " ms");
                        }
                    }
                    console.log(data[i][0], "AC", parseInt(data[i][3]) + " ms");
                }
            }).catch((err) => {
                console.error("Error processing inputs:", err);
                socket.emit('result', `processInputsError: ${err.message}`);
            });
            */
        });
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