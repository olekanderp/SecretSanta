const express = require('express');



const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const mainRouters = require('./routers/router')
const app = express();

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)

})

app.engine('hbs', hbs.engine)
app.set('view engine','hbs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use('/', mainRouters)


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(function() {
    db.run("CREATE TABLE lorem (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name1 TEXT, name2 TEXT, orderUser TEXT)");

    var stmt = db.prepare("INSERT INTO lorem(name1, name2, orderUser) VALUES(?, ?, ?)");
     stmt.run("Sasha" , "Palanyuk", "Дом, Чайник");

    stmt.finalize();

     db.each("SELECT * FROM lorem", function(err, row) {
        console.log(row);
     });
});

//db.close();






app.listen(3000,function(){
    console.log('Server run http://localhost:' + 3000)
});