exports.up = function(knex) {
    return knex.schema.createTable('sessions', function(table) {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('token').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sessions');
};
