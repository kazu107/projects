const { exec } = require('child_process');

exports.execute = (req, res) => {
    const { code } = req.body;
    exec(`python -c "${code}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ output: `Error: ${error.message}` });
        }
        if (stderr) {
            return res.status(500).json({ output: `Error: ${stderr}` });
        }
        res.status(200).json({ output: stdout });
    });
};
