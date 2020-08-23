var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var urlencoded = require('url');
var bodyParser = require('body-parser');
var json = require('json');
var logger = require('logger');
var methodOverride = require('method-override');

var nano = requie('nano')('http://localhost:5948');

var db = nano.use('address');
var app = express;


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.json(__dirname,'public')))

app.get('/', routes.index);


app.post('/createdb', (req, res) => {
    nano.db.create(req.body.dbname, (err) => {
        if (err) {
            res.send('Error creating database' + req.body.dbname);
            return;
        }
        
        res.send("Database" + req.body.dbname + 'created successfully');
    });
});

app.post('/new_contact', (req, res) => {
    var name = req.body.name;
    var phone = req.body.phone;

    db.insert({name:name, phone:phone, crazy:true }, phone, (err, body, header) => { 
        if (err) {
            res.send("Error creating contacts");
            return;
        }

        res.send('Contact created successfully');

     })
});

app.post('/view_contact', (req, res) => {
    var alldoc = "Following are the contacts"
    db.get(req.body.phone, {revs_info:true}, (err, body) => {
        if (!err) {
            console.log(body);
        }

        if (body) {
            alldoc += `name: ${body.name} <br/> Phone Number: ${body.phone} <br/>`;
        }
        else {
            alldoc = 'No record found';
        }
        res.send(alldoc);
    });
});

app.post('/delete_contact', (req, res) => {
    db.get(req.body.phone, {revs_info: true}, (err, body) => {
        if(!err) {
            db.destroy(req.body.phone, body._rev, (err, body) => {
                if(err) {
                    res.send('error deleting contact');
                    return;
                }

                res.send('Contact deleted successfully'); 
            });
        }
    });
});

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on Port ' + app.get('port'));
});
