// languages.js
const path = require('path');

const languages = {
    python: {
        //command: '..\\Python\\Python311\\python.exe', // 例: '/usr/bin/python3' または 'C:\\Python39\\python.exe'
        command: 'python',
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'main.py'),
        needsCompilation: false,
    },
    cpp: {
        compiler: '..\\exec_env\\msys64\\ucrt64\\bin\\g++.exe', // 例: '/usr/bin/g++' または 'C:\\MinGW\\bin\\g++.exe'
        args: (scriptPath) => ['-o', scriptPath.replace('.cpp', ''), scriptPath],
        scriptPath: path.join(__dirname, 'main.cpp'),
        needsCompilation: true,
    },
    c: {
        compiler: '..\\exec_env\\msys64\\ucrt64\\bin\\gcc.exe', // 例: '/usr/bin/gcc' または 'C:\\MinGW\\bin\\gcc.exe'
        args: (scriptPath) => ['-o', scriptPath.replace('.c', ''), scriptPath],
        scriptPath: path.join(__dirname, 'main.c'),
        needsCompilation: true,
    },
    node: {
        command: 'node',
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'main.js'),
        needsCompilation: false,
    },
    ruby: {
        command: 'ruby',
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'main.rb'),
        needsCompilation: false,
    },
    java: {
        compiler: '/path/to/your/compiler/javac', // 例: '/usr/bin/javac' または 'C:\\Program Files\\Java\\jdk-11\\bin\\javac.exe'
        command: '/path/to/your/java', // 例: '/usr/bin/java' または 'C:\\Program Files\\Java\\jdk-11\\bin\\java.exe'
        args: (scriptPath) => [scriptPath.replace('.java', '')],
        scriptPath: path.join(__dirname, 'main.java'),
        needsCompilation: true,
    },
    perl: {
        command: 'perl',
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'script.pl'),
        needsCompilation: false,
    },
    php: {
        command: 'php',
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'script.php'),
        needsCompilation: false,
    },
    rust: {
        compiler: '/path/to/your/compiler/rustc', // 例: '/usr/bin/rustc'
        args: (scriptPath) => [scriptPath],
        scriptPath: path.join(__dirname, 'main.rs'),
        needsCompilation: true,
    },
    kotlin: {
        compiler: '/path/to/your/compiler/kotlinc', // 例: '/usr/bin/kotlinc'
        command: '/path/to/your/kotlin', // 例: '/usr/bin/kotlin'
        args: (scriptPath) => [path.basename(scriptPath, '.kt') + '.kt'],
        scriptPath: path.join(__dirname, 'main.kt'),
        needsCompilation: true,
    },
    csharp: {
        compiler: '/path/to/your/compiler/csc', // 例: '/usr/bin/csc' または 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'
        command: '/path/to/your/dotnet', // 例: '/usr/bin/dotnet'
        args: (scriptPath) => [path.basename(scriptPath, '.cs')],
        scriptPath: path.join(__dirname, 'main.cs'),
        needsCompilation: true,
    },
    go: {
        compiler: '/path/to/your/go', // 例: '/usr/bin/go'
        args: (scriptPath) => ['build', '-o', scriptPath.replace('.go', ''), scriptPath],
        scriptPath: path.join(__dirname, 'main.go'),
        needsCompilation: true,
    }
};

module.exports = languages;
