$("#facebook-login").click(function(){
	e.preventDefault();//this will prevent the link trying to navigate to another page
    var href = $(this).attr("href");//get the href so we can navigate later

    //do the login
    FB_login();

    //when update has finished, navigate to the other page
    window.location = href;
})