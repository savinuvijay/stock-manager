module.exports = function(app,db){

    app.post('/api/login/userlogin', function (req, res) {

        console.log(req.body)
        var username = req.body.username;
        var user;
        db.serialize(() => {
            db.each("SELECT USERNAME, PASSWORD FROM LOGIN WHERE USERNAME = '" + username + "'", (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            user = row;
            },
            function(err, count) {
            if(!user) return res.status(404).send('Item not found');
            else {
                var message = {status : "failed"};
                if(req.body.password == user.password){
                    message.status = "success";
                }
                res.send(message);
            }
            
            });
        });
    });

    app.put('/api/login/changePassword', function (req, res) {

        console.log(req.body)
        var username = req.body.USERNAME;
        var user;
        db.serialize(() => {
            db.each("SELECT USERNAME, PASSWORD FROM LOGIN WHERE USERNAME = '" + username + "'", (err, row) => {
            if (err) {
                console.error("ERROR : " + err.message);
            }
            user = row;
            },
            function(err, count) {
            if(!user) return res.status(404).send('Item not found');
            else {
                console.log(user);
                var message = {status : "failed"};
                if(req.body.PASSWORD == user.password){
                    message.status = "success";
                    item = req.body;
                    let data = [req.body.NewPASSWORD, req.body.USERNAME];
                    console.log(message.status);
                    let sql = `UPDATE LOGIN
                    SET PASSWORD = ?
                    WHERE USERNAME = ?`;
                    db.run(sql, data, function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log(`Row(s) updated: ${this.changes}`);
                        
                        },
                        function(err, count) {
                        res.send(message);
                        });
                    
                }
                //res.send(message);
            }
            
            });
        });
    });

}