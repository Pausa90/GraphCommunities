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
}


// document.getElementsByTagName("body")[0].innerHTML = "hello world";
document.getElementsByTagName("body")[0].innerHTML = getUserFriendList();