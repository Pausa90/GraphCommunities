   window.fbAsyncInit = function() {
        FB.init({
          appId      : '235383066660077',
          status     : true,
          xfbml      : true
        });
	start();
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/all.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk')); 


function getUserFriendList(){
	out = "";
   FB.api('/me/friends', function(response) {
        if(response.data) {
            $.each(response.data,function(index,friend) {
                out += (friend.name + ' has id:' + friend.id) + "\n";
            });
        } else {
            return "Error!";
        }
        
    });
    return out;
}


function start(){
  
  // document.getElementsByTagName("body")[0].innerHTML = "hello world";
  document.getElementsByTagName("body")[0].innerHTML = getUserFriendList();

}