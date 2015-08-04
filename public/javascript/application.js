$(document).ready(function() {

var ContactServer = {
  getAll: function(display){
    $.ajax({
      method: "GET",
      url: "/contacts"
    }).done(display);
  },

  add: function(contact){
    $.ajax({
      method: "POST",
      url: "/contacts",
      data: contact
    }).done(function(response){
        Display.one(JSON.parse(response));
        $( 'form' ).each(function(){
          this.reset();
        });
    });
  }  
}

var Display = {
  all: function(contacts) {
    $.each(contacts, function(i, contact) {
      Display.one(contact);
    });
  },

  one: function(contact){ 
    $("<li class='contact' id='"+contact.id+"'>"+contact.first_name+" "+contact.last_name+"</li>").appendTo("ul");
  }
}

var serialize

// display all contacts on load
ContactServer.getAll(function(contacts){
  Display.all(contacts);
});

$('form').submit(function(e){
  e.preventDefault();
  var contact = $(this).serialize();
  ContactServer.add(contact);
  // parse contact to JSON?
  
});

});
