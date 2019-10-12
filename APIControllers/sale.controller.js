const Joi = require('joi');

module.exports = function(app,db){
    app.get('/api/sale', function (req, res) {
        var stock_items = [];
        console.log("sale api GET");
        db.serialize(() => {
            db.each(`SELECT 
                    SALE_ID,
                    TOTAL_PRICE,
                    SALE_DATE
                    FROM SALE`,
                (err, row) => {
                if (err) {
                console.error("ERROR : " + err.message);
                }
                stock_items.push(row);
            },
            function(err, count) {
                res.send(stock_items);
            });
        });
    });

    app.get('/api/sale/:id', function (req, res) {
        console.log("sale api GET by id = " + req.params.id);
        var stock_item;
        db.serialize(() => {
            db.each(`SELECT 
                    SALE_ID,
                    TOTAL_PRICE,
                    SALE_DATE
                    FROM SALE 
                    WHERE SALE_ID = ` + req.params.id, 
                (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock_item = row;
            },
            function(err, count) {
            if(!stock_item) return res.status(404).send('Item not found');
            res.send(stock_item);
            });
        });
    });

    app.get('/api/sale/last/item', function (req, res) {
        console.log("sale api GET last ");
        var sale;
        db.serialize(() => {
            db.each("SELECT SALE_ID, TOTAL_PRICE, SALE_DATE FROM SALE WHERE SALE_ID = (SELECT MAX(SALE_ID)  FROM SALE)", (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            sale = row;
            },
            function(err, count) {
            if(!sale) return res.status(404).send('Item not found');
            res.send(sale);
            });
        });
    });

    app.post('/api/sale', function (req, res) {
        console.log("sale api POST " + req.body);
        var sale = req.body;
        const { error } = validateItem(sale);
        if(error) return res.status(400).send(error.details[0].message);

        db.run(`INSERT INTO SALE (
                    TOTAL_PRICE,
                    SALE_DATE
                ) 
                VALUES(?, ?)`, 
            [
                sale.TOTAL_PRICE,
                sale.SALE_DATE
            ], function(err) {
            if (err) {
            console.log(err.message);
            
            return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        },
        function(err, count) {
            res.send(sale);
        });
    });

    app.delete('/api/sale/:id', function (req, res) {
        console.log("sale api DELETE by id = " + req.params.id);
        var stock_item;
        db.serialize(() => {
            db.each(`SELECT 
                    SALE_ID,
                    TOTAL_PRICE,
                    SALE_DATE
                    FROM SALE 
                    WHERE SALE_ID = `  + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock_item = row;
            },
            function(err, count) {
            if(!stock_item) return res.status(404).send('Item not found');
            });
        });

        let id = req.params.id;

        db.run(`DELETE FROM SALE WHERE SALE_ID = ?`, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
        },
        function(err, count) {
        res.send(stock_item);
        });
    });

    function validateItem(stock_item){
        const schema = {
            TOTAL_PRICE : Joi.number().required(),
            SALE_DATE : Joi.date().required()
        }
        return Joi.validate(stock_item, schema);
    }
}