var express = require('express');
var router = express.Router();

require('dotenv').config()

const stripe = require('stripe')(process.env.CLEF_PRIVE_STRIPE, {apiVersion: ''});


var dataBike = [
  {nom:'BIKO45', image: 'images/bike-1.jpg', prix: 679},
  {nom:'ZOOK7', image: 'images/bike-2.jpg', prix: 799},
  {nom: 'LIKO89', image: 'images/bike-3.jpg', prix: 839},
  {nom: 'GEMOW8', image: 'images/bike-4.jpg', prix: 1299},
  {nom: 'KIWIT', image: 'images/bike-5.jpg', prix: 899},
  {nom: 'NASAY', image: 'images/bike-6.jpg',prix: 1399}
];




/* GET home page. */

router.get('/', function(req, res, next) {
  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike=[];
  }
  res.render('index', {dataBike});
});


/* === route Shop === */

router.get('/shop', async function(req, res, next) {
  // console.log(req.query)
  // console.log(req.session.dataCardBike)
  var lien = req.query;
  var alreadyExiste=false;
  for(var i = 0; i<req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].nom == lien.nom){
      req.session.dataCardBike[i].quantity++;
      alreadyExiste=true;
      }
  }
  if(alreadyExiste==false){
    req.session.dataCardBike.push({
      nom: lien.nom,
      image: lien.image,
      prix: lien.prix,
      quantity: 1
        })
    }

  /* ==== stripe ===*/
var line_items_stripe = [];
for(var i = 0; i<req.session.dataCardBike.length; i++){
  line_items_stripe.push(
    {
        name : req.session.dataCardBike[i].nom,
        amount : req.session.dataCardBike[i].prix*100, 
        currency: 'eur', 
        quantity : req.session.dataCardBike[i].quantity
    }
  )
};
// console.log(line_items_stripe);

var sessionStripeID;

if(line_items_stripe.length>0){
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items_stripe,
    mode: 'payment',
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
  });

sessionStripeID = session.id ;
}
// console.log(sessionStripeID)

/* === fin stripe ===*/

  res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID});
});



/* === route DeleteShop */

router.get('/delete-shop', async function(req, res, next) {

  req.session.dataCardBike.splice(req.query.position, 1)

  /* ==== stripe ===*/
var line_items_stripe = [];

for(var i = 0; i<req.session.dataCardBike.length; i++){
  line_items_stripe.push(
    {
        name : req.session.dataCardBike[i].nom,
        amount : req.session.dataCardBike[i].prix*100, 
        currency: 'eur', 
        quantity : req.session.dataCardBike[i].quantity
    }
  )
};
// console.log(line_items_stripe);

var sessionStripeID;

if(line_items_stripe.length>0){
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items_stripe,
    mode: 'payment',
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
  });

sessionStripeID = session.id ;
}

// console.log(sessionStripeID)

/* === fin stripe ===*/
  

  res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID} );
});

/* == route updateShop == */

router.post('/update-shop', async function(req, res) {
  // console.log(req.body);

  var quant = req.body.quantity;
  var index = req.body.position;

  req.session.dataCardBike[index].quantity = quant;

  /* ==== stripe ===*/
var line_items_stripe = [];
for(var i = 0; i<req.session.dataCardBike.length; i++){
  line_items_stripe.push(
    {
        name : req.session.dataCardBike[i].nom,
        amount : req.session.dataCardBike[i].prix*100, 
        currency: 'eur', 
        quantity : req.session.dataCardBike[i].quantity
    }
  )
};

var sessionStripeID;

if(line_items_stripe.length>0){
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items_stripe,
    mode: 'payment',
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel',
  });

sessionStripeID = session.id ;
}

/* === fin stripe ===*/
  



  res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID});
});

module.exports = router;
