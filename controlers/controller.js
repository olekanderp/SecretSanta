const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const {validationResult } = require('express-validator');

module.exports.getAll = async function (req, res) {
    try {
        let user = [];
        db.all("SELECT * FROM lorem", function(err, row) {
            user = row
            res.render("MainList.hbs",{
                user:user,
            });
        });
    }catch (e) {
        console.log(e)
    }

}


module.exports.addUser = async function (req, res) {
    try {
        res.render("addUser.hbs");
    }catch (e) {
        console.log(e)
    }

}


module.exports.create = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         //res.status(400).json({ errors: errors.array() });
                res.set('Content-Type', 'text/html');
        return res.send(Buffer.from('<h2>Довжина імені або прізвище замала перейдіть за посиланням да повторного оновлення <a href="/add/user">Додати гравця</a></h2>'));
    }



    try {
        let user = []
        const listOrder = req.body.order.toString()

        db.serialize(function() {
            db.run("CREATE TABLE IF NOT EXISTS lorem (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name1 TEXT, name2 TEXT, orderUser TEXT)");
            var stmt = db.prepare("INSERT INTO lorem(name1, name2, orderUser) VALUES(?, ?, ?)");
            stmt.run(`${req.body.first_name}` , `${req.body.last_name}`, `${listOrder}`);
            stmt.finalize();

            db.each("SELECT * FROM lorem", function(err, row) {
                user.push(row);

            });
        });
        res.redirect('http://localhost:3000/')
    }catch (e) {
        console.log(e)
    }

}

module.exports.shuffle2 = async function (req, res) {
    try {
        db.run('DROP TABLE IF EXISTS shuffle')
        db.all("SELECT * FROM lorem", function(err, row) {
            if (err) throw err;
            let result = [];
            row.forEach(function(user){
                let el = [user.id, user.name1, user.name2, user.orderUser];
                if(user[0]) el.push(user[0]);
                result.push(el);
            });
            result.sort(()=>Math.random()-0.5);
            result.sort(()=>Math.random()-0.5);
            result.sort(()=>Math.random()-0.5);

            db.serialize(function() {
                db.run("CREATE TABLE IF NOT EXISTS shuffle (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, getSanta INTEGER,  name1 TEXT, name2 TEXT, orderUser TEXT)");
                let stmt = db.prepare("INSERT INTO shuffle(getSanta, name1, name2, orderUser) VALUES(?, ?, ?, ?)");
                for (let i = 0; i < result.length; i++) {
                    let shift = (i + 1 >= result.length) ? 0 : i + 1;
                    stmt.run(result[i][0] , result[shift][1], result[shift][2],result[shift][3], function (err) {
                        if (err) throw err;
                    });
                }
            });

        });
        res.json({messege: true})
    }catch (e) {
        console.log(e)
    }

}



module.exports.getSanta = async function (req, res) {
    try {
        let id = req.body.idNumber
        db.all(`SELECT * FROM shuffle WHERE getSanta = ${id}`, function(err, row) {
            console.log(row)
            res.render("info.hbs",{
                info:row,
            });
        });
    }catch (e) {
        console.log(e)
    }


}

module.exports.info = async function (req, res) {
    try {
        res.render('info.hbs');
    }catch (e) {
        console.log(e)
    }


}


module.exports.delete = async function (req, res) {
    try {
        db.run('DROP TABLE IF EXISTS shuffle');
        db.run('DROP TABLE IF EXISTS lorem');


        res.render('MainList.hbs');
    }catch (e) {
        console.log(e)
    }


}