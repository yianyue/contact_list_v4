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
          Display.add(JSON.parse(response));
          // clear form
          $( 'form' ).each(function(){
            this.reset();
          });
      });
    },

    remove: function(id){
      $.ajax({method: "DELETE",
        url: "/contacts/"+id
      }).done(function(){
        Display.remove(id);
      });
    }
  }

  var Display = {
    all: function(contacts) {
      $.each(contacts, function(i, contact) {
        Display.add(contact);
      });
    },

    add: function(contact){
      $("<li class='contact' id='"+contact.id+"'>"+"<button class='delete'>delete</button>"+contact.id+" "+contact.first_name+" "+contact.last_name+" "+contact.email+"</li>").appendTo("ul");
    },

    remove: function(id){
      $('#'+id).remove();
    }
  }

  // display all contacts on load
  ContactServer.getAll(function(contacts){
    Display.all(contacts);
  });

  $('form').submit(function(e){
    e.preventDefault();
    var contact = $(this).serialize();
    ContactServer.add(contact);
  });

  // B/C buttons are dynamically generated and do not exist at document.ready
  $('ul').on('click','button.delete', function(){
      ContactServer.remove($(this).closest('li').attr('id'));
  });

});
