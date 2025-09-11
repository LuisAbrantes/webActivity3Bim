 const express = require('express');

 const app = express();
 
 const methodOverride = require('method-override');
 
 app.use(methodOverride('_method'))
 
 const path = require('path');
 app.use(express.static(path.join(__dirname, 'view')));
 
 // Configurando middlewares
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 const taskRoutes = require('./routes/taskRoute');
 app.use('/', taskRoutes);

 module.exports = app;
