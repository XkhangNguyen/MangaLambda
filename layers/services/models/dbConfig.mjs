import Sequelize from 'sequelize';

import Models from './index.mjs';

console.log("Connecting to database...")


const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'mangadb.crfb5rizs2mo.ap-southeast-1.rds.amazonaws.com',
    port: 5432,
    username: 'mangadb',
    password: '905000Nxk',
    database: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 10,
        min: 1,
        acquire: 15000,
        idle: 30000
    }
});

Models(sequelize);

await sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    });

await sequelize.sync()
    .then(() => {
        console.log('Database tables are synchronized.');
    })
    .catch((error) => {
        console.error('Error synchronizing database tables:', error);
        process.exit(1);
    });

export default sequelize;
