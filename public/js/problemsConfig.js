const socket = io();
//接続
socket.on('connect', function() {
    console.log('Connected to server');
});
//結果を受信してテーブルを更新
socket.on('result', (caseNumber, res, time) => {
    const tableBody = document.querySelector('#result tbody');
    const newRow = document.createElement('tr');
    const resColor = res === "AC" ? "green" : "yellow";
    newRow.innerHTML = `
                <td>${caseNumber}</td>
                <td><span class="result ${resColor}">${res}</span></td>
                <td>${time}</td>
            `;
    tableBody.appendChild(newRow);
});
//テーブルをクリア
socket.on('clearTable', function() {
    const tableBody = document.querySelector('#result tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
});
//プログレスを受信
let cur_num = 0, max_num = 0;
socket.on('progress', (stat, cases_num) => {
    if (stat === "init") {
        cur_num = 0;
        max_num = cases_num;
        const progress = document.getElementById('progress');
        //進捗バーを削除
        if (progress.innerHTML !== "") {
            progress.innerHTML = "";
        }
        //進捗バーを表示
        progress.innerHTML = `
                <p>進捗:<span id="cur_num">0</span> / <span id="max_num">0</span>
                <progress id = "prog-bar" value="" max=""></progress></p>
            `;
    } else if (stat === "next") {
        cur_num++;
    } else {
        cur_num = 0;
    }
    document.getElementById('cur_num').innerText = cur_num;
    document.getElementById('max_num').innerText = max_num;
    document.getElementById('prog-bar').value = cur_num;
    document.getElementById('prog-bar').max = max_num;
});
//コピー
function copyToClipboard(elementId) {
    const code = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(code).then(() => {
        const copyMessage = document.querySelector(`#${elementId} + .copy-message`);
        copyMessage.style.visibility = 'visible';
        setTimeout(() => {
            copyMessage.style.visibility = 'hidden';
        }, 2000);
    });
}
async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem('token');
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + token;
    let response = await fetch(url, options);
    if (!token) {
        return;
    }


    if (response.status === 401) {  // トークンの期限切れ
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            window.location.href = '/login.html';
            return;
        }

        const refreshResponse = await fetch('/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
            const refreshResult = await refreshResponse.json();
            localStorage.setItem('token', refreshResult.accessToken);
            localStorage.setItem('refreshToken', refreshResult.refreshToken);

            options.headers['Authorization'] = 'Bearer ' + refreshResult.accessToken;
            response = await fetch(url, options);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login.html';
            return;
        }
    }

    return response;
}
//コードエディターの設定
document.addEventListener("DOMContentLoaded", function() {
    MathJax.typesetPromise();

    // Initialize ACE Editor
    const editor = ace.edit("txt-editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        fontSize: "14pt",
        showPrintMargin: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
    });
    // 提出ボタンが押されたときの処理
    document.getElementById("run").addEventListener("click", async function() {
        const code = editor.getValue();
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
        console.log('Sent code:', code);
        const response = await fetchWithAuth('/profile');
        if (response.ok) {
            const user = await response.json();
            socket.emit('run', code, pageName, true, user.username);
        }
        else socket.emit('run', code, pageName, false);
    });
});