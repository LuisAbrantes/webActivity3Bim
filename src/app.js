const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'view')));

const initialRoutes = require('./routes/initialRoute');
const turmasRoutes = require('./routes/turmasRuotes');
const alunosRoutes = require('./routes/alunosRoutes');

app.use('/', initialRoutes);
app.use('/turmas', turmasRoutes);
app.use('/alunos', alunosRoutes);

module.exports = app;
