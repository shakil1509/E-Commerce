const express=require('express');
const app=express();
require('dotenv').config()
// const router= express().router()
const con=require('./database/mysqlCon');
require('./database/redisdb');
const cors = require('cors'); // Import cors middleware
const requestLoggerMiddleware = require('./middlewares/requestLogger.middleware');
const morganMiddleware= require('./middlewares/morgan.middleware');
const { logger } = require('./utils/logger.utils');

app.use(express.json());
// Serve static files from the public directory
app.use(express.static('public'));
// Use cors middleware to allow cross-origin requests
app.use(cors());
app.use(morganMiddleware);
app.use(requestLoggerMiddleware);


var usersRouter = require('./routes/users');
// var productRoutes=require('./routes/productRoutes');
// var categoryRoutes= require('./routes/categoryRoutes');
// var cartRoutes= require('./routes/cartRoutes');
// var inventoryRoutes=require('./routes/inventoryRoutes');
// var ordersRoutes= require('./routes/ordersRoutes');

app.use('/users', usersRouter);
// app.use('/categoryManagement',categoryRoutes);
// app.use('/productsManagement',productRoutes);
// app.use('/cartManagement',cartRoutes);
// app.use('/InventoryManagement',inventoryRoutes);
// app.use('/ordersManagement',ordersRoutes);

const PORT=process.env.PORT

app.listen(PORT, () => {
    console.log(`server is listening to PORT no ${PORT}`);
});