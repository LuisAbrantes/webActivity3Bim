const path = require('path');

const paginaInicial = (req, res) => {
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
};

module.exports = {
    paginaInicial
};
