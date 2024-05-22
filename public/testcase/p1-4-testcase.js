module.exports = {
    judge: "normal",
    sample1: {
        input: '15\nsafbbcdeaaccdef',
        output: 'Yes\n',
    },
    sample2: {
        input: '10\nsbcdefscde',
        output: '5\n',
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
        input: '2000000\n' + 'a'.repeat(1000000) + 'b'.repeat(1000000),
        output: 'No\n',
    },
    test4: {
        input: '2000000\n' + 'a'.repeat(200000) + 'b'.repeat(200000) + 'c'.repeat(200000) + 'd'.repeat(200000) + 'e'.repeat(200000) + 'f'.repeat(200000) + 's'.repeat(800000),
        output: 'Yes\n',
    },
}