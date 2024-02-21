const express = require('express');
const cors = require('cors');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./middlewares/errorController')
const userRouter = require('./routes/user.route');

let app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
