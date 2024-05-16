module.exports = {
    development: {
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL || 'postgres://u33ngqkmrm08ln:p9ec62c84ccdf39657dfafb375c8d0a2ccfc78728ccca7c15a1a9263c89aec98b@ceqbglof0h8enj.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1i6astgkj6nda',
            ssl: {
                rejectUnauthorized: false
            }
        },
        migrations: {
            directory: './migrations'
        }
    },
    production: {
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        },
        migrations: {
            directory: './migrations'
        }
    }
};
