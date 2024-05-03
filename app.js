const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const options = {
    mode: 'text',
    pythonPath: `${__dirname}\\Python\\Python311\\python.exe`,
    pythonOptions: ['-u'], // コマンドラインオプション
    scriptPath: __dirname, // スクリプトのディレクトリ指定
    stderrParser: (log) => { return log; },
    stdoutParser: (log) => { return log; }
    //args: [code]
};

app.use(express.static('public'));

// HTMLファイルへのルートを設定
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('run', (code, id) => {
        console.log('Code received: ', code);
        // ファイルにコードを書き込む
        fs.writeFile('sample.py', code, (err) => {
            // セキュリティリスクを減らすための基本的なサニタイズ
            // 実際のアプリケーションではより厳格なチェックが必要
            if (code.match(/import|exec|eval|os\.|sys\./)) {
                socket.emit('result', 'secError: Unsafe code is not allowed.');
                return;
            }
            if (err) {
                console.error('Error writing code to file:', err);
                socket.emit('result', `writeFileError: ${err.message}`);
                return;
            }
            const fileName = `${id}-testcase.js`;
            let problemCases = "";
            try {
                // ファイルのフルパスを解決
                const fullPath = require.resolve(`${__dirname}\\public\\testcase\\${fileName}`);
                console.log("Full path of the module:", fullPath);

                // モジュールを読み込む
                problemCases = require(fullPath);
                // problemCases を使用した処理をここで行う
            } catch (error) {
                console.error("Error loading the module:", error);
            }
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
            processInputs(infos);
            //let escapedCode = code.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
            //インスタンスを作成
            /*
            const pyshell = new PythonShell(`sample.py`,options)
            //実行
            pyshell.on('message', function (msg)  {
                console.log("instance ok");
                console.log(msg);
                const fileName = `${id}-testcase.js`;
                try {
                    const problemCases = require(`public/testcase/${fileName}-testcase.js`);
                    // ここでファイル内のテストケースを利用した処理を行う
                } catch (error) {
                    console.error('Failed to load test cases:', error);
                    socket.emit('error', 'Failed to load test cases');
                }
                socket.emit('result', msg);
            });
            pyshell.on("error",function (err) {
                if (err) {
                    console.error('Error running Python script:', err);
                    socket.emit('result', `Error: ${err.message}`);
                    return;
                }
                console.log('instance error');
            });
            pyshell.end(function (err) {
                if (err) {
                    console.error('Error running Python script:', err);
                    socket.emit('result', `Error: ${err.message}`);
                    return;
                }
                console.log('instance end');
            });
            */
        });
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Pythonスクリプトを実行し、入力を送り、結果を受け取る関数
function runPythonScript(input) {
    return new Promise((resolve, reject) => {
        const pyshell = new PythonShell('sample.py', options);

        pyshell.send(input);

        pyshell.on('message', function(message) {
            console.log(`actual output:`, message);
            pyshell.end(function (err) {
                if (err) {
                    console.error('Error finishing Python script:', err);
                    reject(err);
                } else {
                    console.log(`Python script finished`);
                    resolve(message);
                }
            });
        });

        pyshell.on('error', function(err) {
            console.error('Error from Python script:', err);
            reject(err);
        });
    });
}

// 入力ごとにPythonスクリプトを実行する関数
async function processInputs(inputs) {
    for (let info of inputs) {
        try {
            console.log(`Processing\n${info[1]}`);
            const output = await runPythonScript(info[1]);
            console.log(`expected Output is: `, info[2]);
            if (output === info[2]) {
                console.log(`${info[0]} passed`, "\n");
            } else {
                console.log(`${info[0]} failed`, "\n");
            }
            console.log('Output:', output);
        } catch (err) {
            console.error(`Error processing ${info[1]}:`, err);
        }
    }
}


const port = 3000;
server.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});