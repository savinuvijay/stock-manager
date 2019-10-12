const Joi = require('joi');

module.exports = function(app,db){
    app.get('/api/stock', function (req, res) {
        var stocks = [];
        console.log("stock api GET");
        db.serialize(() => {
            db.each("SELECT STOCK_ID, STOCK_NAME, PURCHASE_DATE, ENTRY_DATE FROM STOCK", (err, row) => {
                if (err) {
                console.error("ERROR : " + err.message);
                }
                stocks.push(row);
            },
            function(err, count) {
                res.send(stocks);
            });
        });
    });

    app.get('/api/stock/:id', function (req, res) {
        console.log("stock api GET by id = " + req.params.id);
        var stock;
        db.serialize(() => {
            db.each("SELECT STOCK_ID, STOCK_NAME, PURCHASE_DATE, ENTRY_DATE FROM STOCK WHERE STOCK_ID = " + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock = row;
            },
            function(err, count) {
            if(!stock) return res.status(404).send('Item not found');
            res.send(stock);
            });
        });
    });

    app.get('/api/stock/last/item', function (req, res) {
        console.log("stock api GET last id = ");
        var stock;
        db.serialize(() => {
            db.each("SELECT STOCK_ID, STOCK_NAME, PURCHASE_DATE, ENTRY_DATE FROM STOCK WHERE STOCK_ID = (SELECT MAX(STOCK_ID)  FROM STOCK)", (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock = row;
            },
            function(err, count) {
            if(!stock) return res.status(404).send('Item not found');
            res.send(stock);
            });
        });
    });

    app.post('/api/stock', function (req, res) {
        console.log("stock api POST");
        var stock = req.body;
        const { error } = validateItem(stock);
        if(error) return res.status(400).send(error.details[0].message);

        db.run("INSERT INTO STOCK(STOCK_NAME, PURCHASE_DATE, ENTRY_DATE) VALUES(?, ?, ?)", [stock.STOCK_NAME, stock.PURCHASE_DATE, stock.ENTRY_DATE ], function(err) {
            if (err) {
            console.log(err.message);
            
            return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        },
        function(err, count) {
            res.send(stock);
        });
    });

    app.delete('/api/stock/:id', function (req, res) {
        console.log("stock api DELETE by id = " + req.params.id);
        var stock;
        db.serialize(() => {
            db.each("SELECT STOCK_ID, STOCK_NAME, PURCHASE_DATE, ENTRY_DATE FROM STOCK WHERE STOCK_ID = " + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock = row;
            },
            function(err, count) {
            if(!stock) return res.status(404).send('Item not found');
            });
        });

        let id = req.params.id;

        db.run(`DELETE FROM STOCK WHERE STOCK_ID = ?`, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
        },
        function(err, count) {
        res.send(stock);
        });
    });

    function validateItem(stock){
        const schema = {
            STOCK_NAME : Joi.string().min(3).required(),
            PURCHASE_DATE : Joi.date().required(),
            ENTRY_DATE : Joi.date().required()
        }
        return Joi.validate(stock, schema);
    }
}