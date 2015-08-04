$(document).ready(function() {
var ContactServer = {
  getAll: function(display){
    $.ajax({
      method: "GET",
      url: "/contacts"
    }).done(display);
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

 // $.ajax({
 //  method: "GET",
 //  url: "/contacts"
 //  }).done(function(contacts) {
 //    $.each(contacts, function(i, contact) {
 //      $("<li class='contact' id='"+contact.id+"'>"+contact.first_name+"</li>").appendTo("ul");
 //    })
 //  });

});
