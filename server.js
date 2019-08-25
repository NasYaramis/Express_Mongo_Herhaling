const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser());
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

var db;
var mySort;

MongoClient.connect('mongodb://localhost', (err, client)=> {
    if(err) return console.log(err)
    db = client.db('examen');
    mySort = { reason: 1};
    app.listen(3000, function(){
        console.log('listening on 3000.');
    })
})

app.get('/', function(req, res){
    res.render('index.ejs');
})

app.get('/list', (req, res) => {
    db.collection('inhaal').find().sort(mySort).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('list.ejs', { inhaal: result })
    })
  })

  app.post('/', function(req, res){   
    var item = req.body.date;
    console.log(item + "sqdd;qs");

    db.collection('inhaal').find().sort(mySort).toArray((err, result) => {
        if (err) return console.log(err)
        var i;
        var unique = false;
        for (i = 0; i < result.length; i++) { 

            //console.log(req.body.description == result[i].reason )
            if(req.body.name == result[i].name && req.body.description == result[i].description && req.body.reason == result[i].reason){
               unique = true;
        }
        
    }
    if(unique == false){
        db.collection('inhaal').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)
        
            console.log('saved to database')
            
          })
      }
      else{
        console.log('duplicated')
      }
      res.redirect('/list');
    
    })
    
})

app.get('/list', function(req, res){
    res.render('list.ejs');
})

// Show the search form
app.get("/search", (req, res) => {
    res.render("search.ejs", { student: "" });
  });

  app.post('/search', (req, res) => {
    var input = req.body.name;
    db.collection('inhaal').find({"name":input}).sort(mySort).toArray(function(err, result) {
        if (err) return console.log(err)
        if (result == '')
            res.render('search_not_found.ejs', {})
        else
            res.render('search_result.ejs', { student: result })
    });
});