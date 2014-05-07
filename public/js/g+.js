/** Init **/

(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; 
  po.async = true;
  po.src = 'https://plus.google.com/js/client:plusone.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();

/** Variabili Globali **/

var Ggraph = {}
var apiCaller_count = 0;7
var access_token;


function G_login(authResult){
  if (authResult['access_token']) {
    // Autorizzazione riuscita
    // Nascondi il pulsante di accesso ora che l'utente è autorizzato. Ad esempio: 
    access_token = authResult['access_token'];
    showButton();
  } else if (authResult['error']) {
    // Si è verificato un errore.
    // Possibili codici di errore:
    //   "access_denied" - L'utente ha negato l'accesso alla tua app
    //   "immediate_failed" - Impossibile eseguire l'accesso automatico dell'utente
    console.log('There was an error: ' + authResult['error']);
  }
}

function showButton(){
  document.getElementById("google_login_button").style.display='none';
  document.getElementById("google_logout_button").style.display='block';
  document.getElementById("createGGraph_button").style.display='block';
}

function G_logout(){
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
      access_token;

  // Esecuzione di una richiesta GET asincrona.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
      // Esegui un'azione, l'utente è disconnesso
      // La risposta è sempre indefinita.
      location.reload();
    },
    error: function(e) {
      // Gestione dell'errore
      // console.log(e);
      // Puoi indirizzare gli utenti alla disconnessione manuale in caso di esito negativo
      // https://plus.google.com/apps
      alert('Impossibile uscire');
    }
  });
}


function createGGraph(){
  console.log("da implementare");
}