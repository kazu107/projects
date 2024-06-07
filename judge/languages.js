// languages.js
const path = require('path');

const languages = {
    py: {
        //command: '.\\Python\\Python311\\python.exe', // 例: '/usr/bin/python3' または 'C:\\Python39\\python.exe'
        command: 'python',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.py',
        needsCompilation: false,
    },
    cpp: {
        compiler: '.\\msys64\\ucrt64\\bin\\g++', // 例: '/usr/bin/g++' または 'C:\\MinGW\\bin\\g++.exe'
        //compiler: 'g++',
        args: (scriptPath) => ['-o', scriptPath.replace('.cpp', ''), scriptPath],
        scriptPath: 'judge\\langFile\\main.cpp',
        needsCompilation: true,
    },
    c: {
        compiler: '.\\msys64\\ucrt64\\bin\\gcc.exe', // 例: '/usr/bin/gcc' または 'C:\\MinGW\\bin\\gcc.exe'
        //compiler: 'gcc',
        args: (scriptPath) => ['-o', scriptPath.replace('.c', ''), scriptPath],
        scriptPath: 'judge\\langFile\\main.c',
        needsCompilation: true,
    },
    js: {
        command: 'node',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.js',
        needsCompilation: false,
    },
    rb: {
        command: 'ruby',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.rb',
        needsCompilation: false,
    },
    java: {
        //compiler: '/path/to/your/compiler/javac', // 例: '/usr/bin/javac' または 'C:\\Program Files\\Java\\jdk-11\\bin\\javac.exe'
        //command: '/path/to/your/java', // 例: '/usr/bin/java' または 'C:\\Program Files\\Java\\jdk-11\\bin\\java.exe'
        compiler: 'javac',
        command: 'java',
        args: (scriptPath) => [scriptPath.replace('.java', '')],
        scriptPath: 'judge\\langFile\\main.java',
        needsCompilation: true,
    },
    pl: {
        command: 'perl',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.pl',
        needsCompilation: false,
    },
    php: {
        command: 'php',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.php',
        needsCompilation: false,
    },
    rs: {
        //compiler: '/path/to/your/compiler/rustc', // 例: '/usr/bin/rustc'
        compiler: 'rustc',
        args: (scriptPath) => [scriptPath],
        scriptPath: 'judge\\langFile\\main.rs',
        needsCompilation: true,
    },
    kt: {
        //compiler: '/path/to/your/compiler/kotlinc', // 例: '/usr/bin/kotlinc'
        //command: '/path/to/your/kotlin', // 例: '/usr/bin/kotlin'
        compiler: 'kotlinc',
        command: 'kotlin',
        args: (scriptPath) => [path.basename(scriptPath, '.kt') + '.kt'],
        scriptPath: 'judge\\langFile\\main.kt',
        needsCompilation: true,
    },
    cs: {
        //compiler: '/path/to/your/compiler/csc', // 例: '/usr/bin/csc' または 'C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'
        //command: '/path/to/your/dotnet', // 例: '/usr/bin/dotnet'
        compiler: 'csc',
        command: 'dotnet',
        args: (scriptPath) => [path.basename(scriptPath, '.cs')],
        scriptPath: 'judge\\langFile\\main.cs',
        needsCompilation: true,
    },
    go: {
        //compiler: '/path/to/your/go', // 例: '/usr/bin/go'
        compiler: 'go',
        args: (scriptPath) => ['build', '-o', scriptPath.replace('.go', ''), scriptPath],
        scriptPath: 'judge\\langFile\\main.go',
        needsCompilation: true,
    }
};

module.exports = languages;
