const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../database/stockDatabase.db');

app.use(express.static('./dist/stock-manager'));
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname,'dist/stock-manager/index.html'))
});

var controller = 'APIControllers';

require('./'+controller+'/items.controller')(app,db);
require('./'+controller+'/login.controller')(app,db);
require('./'+controller+'/stock.controller')(app,db);
require('./'+controller+'/stock_item.controller')(app,db);
require('./'+controller+'/sale_item.controller')(app,db);
require('./'+controller+'/sale.controller')(app,db);

app.listen(process.env.PORT || '8085', ()=> {
    console.log('working on 8085');
});
