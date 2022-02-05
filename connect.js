const { Client } = require('pg');

process.env.PGHOST='localhost';
process.env.PGUSER='postgres';
process.env.PGDATABASE='salon_groom';
process.env.PGPASSWORD='postgres_12345';
process.env.PGPORT=5432;

const sql = 'SELECT NOW() as now';
const client_pg = new Client();
client_pg.connect();

// promise
client_pg
    .query(sql)
    .then(res => {
        // console.log(res.fields.map(field => field.name)) // ['first_name', 'last_name']
        // console.log(res.rows[0]) // ['Brian', 'Carlson']
        console.log( res.rows );
    })
    .catch(e => console.error(e.stack));

// clients will also use environment variables
// for connection information
(async () => {
    try {
        const client_pg = new Client();

        // log({ client_pg });

        await client_pg.connect();

        process.env.PG_CONNECTION = true;

        const res = await client_pg.query('SELECT NOW()');
        console.log(res.rows);
        await client_pg.end();

        // log({ 'connection': process.env.PG_CONNECTION });
    } catch(e) {
        process.env.PG_CONNECTION = false;
        // log({ 'connection': process.env.PG_CONNECTION });
        console.log(e.message);
    }
})();
