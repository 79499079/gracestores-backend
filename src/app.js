const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config();

const app = express();

//Settings
app.set('port', process.env.PORT || 5000)


//Midlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Variables Globales
app.use((req, res, next) => {  
  res.locals.user = req.user || null;  
  next();
});

//Routes
app.use(require('./routers/user.routes') )
app.use(require('./routers/categorias.routes') )
app.use(require('./routers/product.routes') )
app.use(require('./routers/order.routes') )
app.use(require('./routers/upload.routes') )

app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});

app.use((error, req, res, next) => {
  res.status(500).send({message: error.message})
})

module.exports = app;