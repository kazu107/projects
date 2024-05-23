const fs = require('fs');
const path = require('path');

const largeInput1 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-4', 'p1-4-test3.txt'), 'utf8');
const largeInput2 = fs.readFileSync(path.join(__dirname, 'largeinputs', 'p1-4', 'p1-4-test4.txt'), 'utf8');

module.exports = {
    judge: "normal",
    sample1: {
        input: '15\nsafbbcdeaaccdef',
        output: 'Yes\n',
    },
    sample2: {
        input: '10\nsbcdefscde',
        output: 'No\n',
    },
    test1: {
        input: '10\nabcdefabcd',
        output: 'No\n',
    },
    test2: {
        input: '10\nsaabbcdeff',
        output: 'Yes\n',
    },
    test3: {
        input: largeInput1,
        output: 'No\n',
    },
    test4: {
        input: largeInput2,
        output: 'Yes\n',
    },
};