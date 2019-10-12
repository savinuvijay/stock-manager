const Joi = require('joi');

module.exports = function(app,db){
    app.get('/api/items', function (req, res) {
        console.log("items api GET");
        var items = [];
        db.serialize(() => {
            db.each("SELECT ID, NAME FROM ITEMS", (err, row) => {
                if (err) {
                console.error("ERROR : " + err.message);
                }
                items.push(row);
            },
            function(err, count) {
                res.send(items);
            });
        });
    });

    app.get('/api/items/:id', function (req, res) {
        console.log("items api GET by id = " + req.params.id);
        var item;
        db.serialize(() => {
            db.each("SELECT ID, NAME FROM ITEMS WHERE ID = " + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            item = row;
            },
            function(err, count) {
            if(!item) return res.status(404).send('Item not found');
            res.send(item);
            });
        });
    });

    app.post('/api/items', function (req, res) {
        console.log("items api POST");
        var item = req.body;
        const { error } = validateItem(item);
        if(error) return res.status(400).send(error.details[0].message);

        db.run(`INSERT INTO ITEMS(NAME) VALUES(?)`, [item.NAME], function(err) {
            if (err) {
            console.log(err.message);
            
            return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        },
        function(err, count) {
            res.send(item);
        });
    });

    app.put('/api/items/:id', function (req, res) {
        console.log("items api PUT by id = " + req.params.id);
        var item;
        db.serialize(() => {
            db.each("SELECT ID, NAME FROM ITEMS WHERE ID = " + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            item = row;
            },
            function(err, count) {
            if(!item) return res.status(404).send('Item not found');
            });
        });

        const { error } = validateItem(item);
        if(error) return res.status(400).send(error.details[0].message);

        item = req.body;
        let data = [item.name, req.params.id];
        console.log(data);
        let sql = `UPDATE ITEMS
                    SET NAME = ?
                    WHERE ID = ?`;
        
        db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
        
        },
        function(err, count) {
        res.send(item);
        });
    });

    app.delete('/api/items/:id', function (req, res) {
        console.log("items api DELETE by id = " + req.params.id);
        var item;
        db.serialize(() => {
            db.each("SELECT ID, NAME FROM ITEMS WHERE ID = " + req.params.id, (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            item = row;
            },
            function(err, count) {
            if(!item) return res.status(404).send('Item not found');
            });
        });

        let id = req.params.id;
        // delete a row based on id
        db.run(`DELETE FROM ITEMS WHERE ID=?`, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
        },
        function(err, count) {
        res.send(item);
        });
    });

    function validateItem(item){
        const schema = {
            NAME : Joi.string().min(3).required()
        }
        return Joi.validate(item, schema);
    }
}