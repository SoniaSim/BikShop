var stripe = Stripe('pk_test_51GyDmdAcDVPHtKeMlXJplqLiS2rzDOPZdxKVYIo07ljAW2zzioUMgKILNzPro6eW5UwCS8fgP6TrkXGBDjdOrXju00ZJV5r08P')

$('#check').click(function(){
    
stripe.redirectToCheckout({
    sessionId: sessionStripeID, 
  }).then(function (result) {
  });
});
