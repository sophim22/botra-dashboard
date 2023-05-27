require("dotenv").config();
const pg = require("pg").types;
const { setTypeParser, builtins } = pg;
const typesToReset = [
  builtins.DATE,
  builtins.TIME,
  builtins.TIMETZ,
  builtins.TIMESTAMP,
  builtins.TIMESTAMPTZ
];
function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    setTypeParser(pgType, val => String(val)); // like noParse() function underhood pg lib
  }
}

const configTimezone = {
  afterCreate: function(conn, done) {
    conn.query('SET timezone="Asia/Tokyo";', function(err) {
      done(err, conn);
    });
  }
};

resetPgDateParsers();
const connection = {
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME,
    timezone: "Japan"
  },
  pool: { min: 0, max: 10, ...configTimezone }
};

const rootPath = process.cwd();
const migrations = {
  migrations: {
    directory: rootPath + "/src/db/migrations"
  },
  seeds: {
    directory: rootPath + "/src/db/seeds"
  }
};

module.exports = {
  development: {
    ...connection,
    ...migrations
  },

  production: {
    ...connection,
    ...migrations,
    pool: {
      ...configTimezone,
      min: 2,
      max: 10
    }
  }
};
