const Joi = require('joi');

module.exports = function(app,db){
    app.get('/api/stock_item', function (req, res) {
        var stock_items = [];
        console.log("stock_item api GET");
        db.serialize(() => {
            db.each(`SELECT 
                    STOCK_ITEM_ID, 
                    STOCK_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY, 
                    COST_PRICE, 
                    SELLING_PRICE,
                    INITIAL_QUANTITY 
                    FROM STOCK_ITEM`,
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

    app.get('/api/stock_item/item/:id', function (req, res) {
        console.log("stock_item api GET by id = " + req.params.id);
        var stock_item;
        db.serialize(() => {
            db.each(`SELECT 
                    STOCK_ITEM_ID, 
                    STOCK_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY, 
                    COST_PRICE, 
                    SELLING_PRICE,
                    INITIAL_QUANTITY 
                    FROM STOCK_ITEM 
                    WHERE STOCK_ITEM_ID = ` + req.params.id, 
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

    app.get('/api/stock_item/stock/:id', function (req, res) {
        console.log("stock_item api GET by stock id = " + req.params.id);
        var stock_items = [];
        db.serialize(() => {
            db.each(`SELECT 
                    STOCK_ITEM_ID, 
                    STOCK_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY, 
                    COST_PRICE, 
                    SELLING_PRICE,
                    INITIAL_QUANTITY 
                    FROM STOCK_ITEM 
                    WHERE STOCK_ID = ` + req.params.id, 
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

    app.post('/api/stock_item', function (req, res) {
        console.log("stock_item api POST");
        var stock_item = req.body;
        const { error } = validateItem(stock_item);
        if(error) return res.status(400).send(error.details[0].message);

        db.run(`INSERT INTO STOCK_ITEM (
                STOCK_ID, 
                ITEM_ID, 
                ITEM_NAME, 
                QUANTITY, 
                COST_PRICE, 
                SELLING_PRICE,
                INITIAL_QUANTITY
                ) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`, 
            [
                stock_item.STOCK_ID, 
                stock_item.ITEM_ID, 
                stock_item.ITEM_NAME, 
                stock_item.QUANTITY, 
                stock_item.COST_PRICE, 
                stock_item.SELLING_PRICE,
                stock_item.QUANTITY
            ], function(err) {
            if (err) {
            console.log(err.message);
            
            return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        },
        function(err, count) {
            res.send(stock_item);
        });
    });

    app.post('/api/stock_item/list', function (req, res) {
        try{
        console.log("stock_item api POST list");
        var stock_items = req.body.stock_items;
        var stock_id = req.body.stock_id;
        console.log(stock_items);
        console.log(stock_id);
        stock_items.forEach(stock_item => {
            console.log("in loop");
            console.log(stock_item);
            const { error } = validateItem(stock_item);
            if(error) return res.status(400).send(error.details[0].message);
            db.run(`INSERT INTO STOCK_ITEM (
                STOCK_ID, 
                ITEM_ID, 
                ITEM_NAME, 
                QUANTITY, 
                COST_PRICE, 
                SELLING_PRICE,
                INITIAL_QUANTITY
                ) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`, 
            [
                stock_id,
                stock_item.ITEM_ID, 
                stock_item.ITEM_NAME, 
                stock_item.QUANTITY, 
                stock_item.COST_PRICE, 
                stock_item.SELLING_PRICE,
                stock_item.QUANTITY
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
        res.json(stock_items);
    }
    catch (err){
        console.log(err);
    }
    });

    app.put('/api/stock_item/update_quantity/:id', function (req, res) {
        console.log("stock_items api PUT by id = " + req.params.id);
        var stock_item;
        db.serialize(() => {
            db.each(`SELECT 
                    STOCK_ITEM_ID, 
                    STOCK_ID, 
                    ITEM_ID, 
                    ITEM_NAME, 
                    QUANTITY, 
                    COST_PRICE, 
                    SELLING_PRICE,
                    INITIAL_QUANTITY 
                    FROM STOCK_ITEM 
                    WHERE STOCK_ITEM_ID = ` + req.params.id, 
                (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            stock_item = row;
            },
            function(err, count) {
            if(!stock_item) return res.status(404).send('Item not found');
                //res.send(stock_item);
                var newQuantity = stock_item.QUANTITY - req.body.QUANTITY;
                if(newQuantity >= 0){
                    stock_item.QUANTITY = newQuantity;
                    console.log(stock_item);
                    console.log(newQuantity);
                    db.run(`UPDATE STOCK_ITEM
                            SET QUANTITY = ?
                            WHERE STOCK_ITEM_ID = ?`, 
                            [
                                newQuantity, 
                                req.params.id
                            ], function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`Row(s) updated: ${this.changes}`);
                    
                    },
                    function(err, count) {
                    res.send(stock_item);
                    });
                }
                else{
                    return res.status(400).send('Sufficient number of items not present');
                }
            });
            
        });
    });

    app.put('/api/stock_item/list/update_quantity', function (req, res) {
        console.log("stock_items api PUT by list");
        try{
            console.log("stock_item api POST list");
            var sale_items = req.body;
            console.log(sale_items);
            var stock_items = [];
            sale_items.forEach(sale_item => {
                console.log("in loop");
                //console.log(sale_item);
                var stock_item;
                db.serialize(() => {
                    db.each(`SELECT 
                            STOCK_ITEM_ID, 
                            STOCK_ID, 
                            ITEM_ID, 
                            ITEM_NAME, 
                            QUANTITY, 
                            COST_PRICE, 
                            SELLING_PRICE,
                            INITIAL_QUANTITY 
                            FROM STOCK_ITEM 
                            WHERE STOCK_ITEM_ID = ` + sale_item.STOCK_ITEM_ID, 
                        (err, row) => {
                    if (err) {
                        console.error("ERROR : " + err.message);
                    }
                    stock_item = row;
                    },
                    function(err, count) {
                        if(!stock_item) return res.status(404).send('Item not found');
                        var newQuantity = stock_item.QUANTITY - sale_item.QUANTITY;
                        //console.log(stock_item);
                        if(newQuantity >= 0){
                            stock_item.QUANTITY = newQuantity;
                            //console.log("New Stock Items : ");
                            //console.log(stock_item);
                            db.run(`UPDATE STOCK_ITEM
                                    SET QUANTITY = ?
                                    WHERE STOCK_ITEM_ID = ?`, 
                                    [
                                        newQuantity, 
                                        sale_item.STOCK_ITEM_ID
                                    ], function(err) {
                            if (err) {
                                return console.error(err.message);
                            }
                            console.log(`Row(s) updated: ${this.changes}`);
                            stock_items.push(stock_item);
                            },
                            function(err, count) {
                            });
                        }
                        else{
                            return res.status(400).send('Sufficient number of items not present');
                        }
                    });
                    
                });
            });
            res.json(stock_items);
        }
        catch (err){
            console.log(err);
        }
            
    });


    app.delete('/api/stock_item/:id', function (req, res) {
        console.log("stock_item api DELETE by id = " + req.params.id);
        var stock_item;
        db.serialize(() => {
            db.each(`SELECT 
                    STOCK_ITEM_ID, 
                    STOCK_ID, 
                    ITEM_ID, 
                    ITME_NAME, 
                    QUANTITY, 
                    COST_PRICE, 
                    SELLING_PRICE,
                    INITIAL_QUANTITY  
                    FROM STOCK_ITEM_ID 
                    WHERE STOCK_ITEM_ID = ` + req.params.id, (err, row) => {
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

        db.run(`DELETE FROM STOCK_ITEM WHERE STOCK_ITEM_ID = ?`, id, function(err) {
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
            STOCK_ITEM_ID : Joi.number().required(),
            STOCK_ID : Joi.number().required(),
            ITEM_ID : Joi.number().required(),
            ITEM_NAME : Joi.string().required(),
            QUANTITY : Joi.number().required(), 
            COST_PRICE : Joi.number().required(),
            SELLING_PRICE : Joi.number().required(),
            INITIAL_QUANTITY : Joi.number()
        }
        return Joi.validate(stock_item, schema);
    }
}