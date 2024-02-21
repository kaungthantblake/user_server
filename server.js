const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
 })

const app = require('./app');

const options = {
  connectTimeoutMS: 10000, // 30 seconds
};

mongoose.connect(process.env.DB_URL, options).then((conn) => {
  console.log(`Database connected with ${conn.connection.host}`);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`server has started at port ${port}`);
})

process.on('unhandledRejection', (err) => {
   console.log(err.name, err.message);
   console.log('Unhandled rejection occurred! Shutting down...');

   server.close(() => {
    process.exit(1);
   })
})

