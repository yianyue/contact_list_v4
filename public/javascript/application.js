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

ContactServer.getAll(function(contacts){
  Display.all(contacts);
});

$('form').submit(function(e){
  e.preventDefault();
  var contact = { contact: {
    first_name: $('#first_name').val(),
    last_name: $('#last_name').val(),
    email: $('#email').val(),
    phone_num: $('#phone_num').val()
    }
  }
  ContactServer.add(contact);
});

});
