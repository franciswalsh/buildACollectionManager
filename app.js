'use strict'

const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// const models = require('./models');
const Planet = require('./models/planets.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());

app.use(session({
  // genid: function(req),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(__dirname));
app.use('/static', express.static('static'));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', './views');

mongoose.connect('mongodb://localhost:27017/buildACollectionManager');


app.get('/', function(req, res){
  res.render('homescreen')
});
app.get('/addPlanet/', function(req, res){
  res.render('addToCollection');
});
app.post('/addPlanet/', function(req, res){
  var planet = new Planet({
    name: req.body.planetName,
    orbit: req.body.orbit,
    size: req.body.planetSize
  });

  planet.save().then(function(){
    console.log("Successfully added planet!");
  }).catch(function(){
    console.log("something wrong");
  })
  res.redirect('/');
});
app.get('/viewCollection', function(req, res){
  Planet.find({}).then(function(planets){
    console.log(planets);
    res.render('viewCollection', {
      planets: planets
    });
  }).catch(function(error){
    console.log(error);
  })
});
app.post('/edit/:id', function(req, res){
  let planetId = req.params.id;
  res.redirect(planetId);
});
app.get('/edit/:id', function(req, res){
  let planetId = req.params.id;
  console.log(req.params);
  res.render('editCollection', {
    parameters: req.params
  });
});
app.post('/editing/:id', function(req, res){
  let planetId = req.params.id;
  let newPlanetName = req.body.newPlanetName;
  let newOrbit = req.body.newOrbit;
  let newPlanetSize = req.body.newPlanetSize;
  Planet.updateOne(
    {
      _id: planetId
    },
    {
      $set: {
        name:  newPlanetName,
        orbit: newOrbit,
        size: newPlanetSize
      }
    }
  ).catch(function(errors,affected,resp){
    console.log(errors);
  });
  res.redirect('/');
});
app.post('/delete/:id', function(req, res){
  let planetId = req.params.id;
  Planet.deleteOne({_id: planetId}).then(function(){
    res.redirect('/');
  }).catch(function(error,b,c){
    console.log(error);
  });
});
app.listen(3000, function(){
  console.log("Successfully started express application!");
})
