//app.js
const express = require('express');
const cors   = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//Middlewares
app.use(helmet());
app.use(cors({
    origin: process.CORS_ORIGIN || '*' //adaptar em producao
}));

app.use(express.json({limit: '10kb'})); //body parsing
app.use(morgan('dev'));

//Routes
app.use('/api/users', userRoutes);

//health check
app.get('/health', (req, res)=> res.status(200).json({status: 'ok', time: new Date().toISOString() }));

//error Handler (ultimo)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});