module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    ENV: process.env.NODE_ENV || 'development',
};