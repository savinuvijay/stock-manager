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

}