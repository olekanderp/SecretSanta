const sqlite3 = require('sqlite3').verbose();

exports.getPlayerData = function(callback){
    const db = new sqlite3.Database(':memory:')
    var data = []; //for storing the rows.
    db.serialize(function() {
        db.each("SELECT * FROM lorem", function(err, row) {
            data.push(row); //pushing rows into array
        }, function(){ // calling function when all rows have been pulled
            db.close(); //closing connection
            callback(data);
        });
    });
}