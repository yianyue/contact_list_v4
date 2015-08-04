$(document).ready(function() {
 $.ajax({
  method: "GET",
  url: "/contacts"
})
  .done(function(contacts) {
    $.each(contacts, function(i, contact) {
      console.log(contact);
      $("<li class='contact' id='"+contact.id+"'>"+contact.first_name+"</li>").appendTo("ul");
    })
  });

});
