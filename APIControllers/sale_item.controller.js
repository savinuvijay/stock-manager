const Joi = require('joi');

module.exports = function(app,db){
    app.get('/api/sale_item', function (req, res) {
        var sales = [];
        console.log("sale_item api GET");
        db.serialize(() => {
            db.each(`SELECT
                    SALE_ITEM_ID,
                    SALE_ID,
                    STOCK_ID,
                    STOCK_ITEM_ID, 
                    ITEM_ID, 
                    ITEM_NAME,
                    QUANTITY 
                    FROM SALE_ITEM`,
                (err, row) => {
                if (err) {
                console.error("ERROR : " + err.message);
                }
                sales.push(row);
            },
            function(err, count) {
                res.send(sales);
            });
        });
    });

    app.get('/api/sale_item/:id', function (req, res) {
        console.log("sale_item api GET by id = " + req.params.id);
        var sale;
        db.serialize(() => {
            db.each(`SELECT 
                    SALE_ITEM_ID,
                    SALE_ID,
                    STOCK_ID,
                    STOCK_ITEM_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY 
                    FROM SALE_ITEM
                    WHERE SALE_ITEM_ID = ` + req.params.id, 
                (err, row) => {
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

    app.get('/api/sale/sale_items/:id', function (req, res) {
        console.log("sale_items api GET by sale id = " + req.params.id);
        var sale_items = [];
        db.serialize(() => {
            db.each(`SELECT 
                sale.SALE_ID, 
                sale.SALE_DATE, 
                stock.STOCK_NAME, 
                stock_item.ITEM_NAME, 
                stock_item.SELLING_PRICE, 
                sale_item.QUANTITY, 
                sale.TOTAL_PRICE
            FROM sale_item 
            INNER JOIN sale ON sale_item.SALE_ID = sale.SALE_ID 
            INNER JOIN stock ON sale_item.STOCK_ID = stock.STOCK_ID 
            INNER JOIN stock_item ON sale_item.STOCK_ITEM_ID = stock_item.STOCK_ITEM_ID 
            where sale.SALE_ID = ` + req.params.id, 
                (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            sale_items.push(row);
            },
            function(err, count) {
            if(!sale_items) return res.status(404).send('Item not found');
            res.send(sale_items);
            });
        });
    });

    app.post('/api/sale_item', function (req, res) {
        console.log("sale_item api POST");
        var sale = req.body;
        const { error } = validateItem(sale);
        if(error) return res.status(400).send(error.details[0].message);

        db.run(`INSERT INTO SALE_ITEM (
                SALE_ID,
                STOCK_ID,
                STOCK_ITEM_ID, 
                ITEM_ID, 
                ITEM_NAME,
                QUANTITY, 
                ) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`, 
            [
                sale.SALE_ID,
                sale.STOCK_ID,
                sale.STOCK_ITEM_ID, 
                sale.ITEM_ID, 
                sale.ITEM_NAME,
                sale.PRICE, 
                sale.QUANTITY, 
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

    app.post('/api/sale_item/list', function (req, res) {
        try{
        console.log("sale_item api POST list");
        var sale_items = req.body.sale_items;
        var sale_id = req.body.sale_id;
        console.log(sale_items);
        console.log(sale_id);
        sale_items.forEach(sale_item => {
            console.log("in loop");
            console.log(sale_item);
            console.log("Sale_id = ", sale_id);
            const { error } = validateItem(sale_item);
            if(error) return res.status(400).send(error.details[0].message);
            db.run(`INSERT INTO SALE_ITEM (
                SALE_ID,
                STOCK_ID,
                STOCK_ITEM_ID, 
                ITEM_ID, 
                ITEM_NAME, 
                QUANTITY
                ) 
                VALUES(?, ?, ?, ?, ?, ?)`, 
            [
                sale_id,
                sale_item.STOCK_ID, 
                sale_item.STOCK_ITEM_ID,
                sale_item.ITEM_ID, 
                sale_item.ITEM_NAME, 
                sale_item.QUANTITY
            ], function(err) {
            if (err) {
            console.log(err.message);
            
            return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            },
            function(err, count) {
                //res.send(stock_item);
            });
        });
        res.json(sale_items);
    }
    catch (err){
        console.log(err);
    }
    });

    app.delete('/api/sale_item/:id', function (req, res) {
        console.log("sale_item api DELETE by id = " + req.params.id);
        var sale;
        db.serialize(() => {
            db.each(`SELECT 
                    SALE_ID,
                    STOCK_ID,
                    STOCK_ITEM_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY
                    FROM SALE_ITEM
                    WHERE SALE_ITEM_ID =` + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            sale = row;
            },
            function(err, count) {
            if(!sale) return res.status(404).send('Item not found');
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
        res.send(sale);
        });
    });

    function validateItem(sale_item){
        const schema = {
            STOCK_ID : Joi.number().required(),
            STOCK_ITEM_ID : Joi.number().required(),
            ITEM_ID : Joi.number().required(),
            ITEM_NAME : Joi.string().required(),
            QUANTITY : Joi.number().required()
        }
        return Joi.validate(sale_item, schema);
    }
    //select sale.SALE_ID, sale.SALE_DATE, stock.STOCK_NAME, stock_item.ITEM_NAME, stock_item.SELLING_PRICE, sale_item.QUANTITY, sale.TOTAL_PRICE
    //FROM sale_item 
    //INNER JOIN sale ON sale_item.SALE_ID = sale.SALE_ID 
    //INNER JOIN stock ON sale_item.STOCK_ID = stock.STOCK_ID 
    //INNER JOIN stock_item ON sale_item.STOCK_ITEM_ID = stock_item.STOCK_ITEM_ID 
    //where sale.SALE_ID = 15;
}