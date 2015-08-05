$(document).ready(function() {
  // ajax requests
  var ContactServer = {
    getAll: function(){
      $.ajax({
        method: "GET",
        url: "/contacts",
        dataType: 'json'
      }).done(function(response){
        ClientData.addAll(response);
      });
    },

    add: function(contact){
      $.ajax({
        method: "POST",
        url: "/contacts",
        dataType: 'json',
        data: contact
      }).done(function(response){
        ClientData.add(response);
      });
    },

    remove: function(id){
      $.ajax({
        method: "DELETE",
        url: "/contacts/"+id
      }).done(function(){
        ClientData.remove(id);
      });
    }
  }

  // storing data on client side
  var ClientData = {
    localData: {},
    add: function(contact){
      this.localData[contact.id] = contact;
      Display.add(contact);
    },
    addAll: function(contacts){
      $.each(contacts,function(i, contact){
        ClientData.add(contact);
      });
    },
    remove: function(id){
      delete this.localData[id];
      Display.remove(id);
    },
    getById: function(id){
      return this.localData[id];
    }

  }

  // DOM manipulations
  var Display = {
    add: function(contact){
      $('#contacts').append('<li class="contact" id="'+contact.id+'"></li>')
      $('#'+contact.id).append(contact.first_name+" "+contact.last_name)
      .append("<button class='detail'>detail</button>")
      .append("<button class='delete'>delete</button>")
      .append("<button class='edit'>edit</button>")
      .append('<div class="detail">'+contact.email+'</div>');
      $('#contacts').find('div.detail').hide();
    },
    remove: function(id){
      $('#'+id).remove();
    },
    clearForm: function(id){
      $('form#'+ id).each(function(){
          this.reset();
      }); 
    },
    toggleDetail: function(id){
      $('#'+id).find('div.detail').toggle();
    },
    editForm: function(id){
      var contact = ClientData.getById(id);
      var form = $('form#edit');
      form.detach();
      $('#'+id).append(form);
      form.show();
    }
  }

  // display all contacts on load
  ContactServer.getAll();
  $('#edit').hide();

  $('#add-new').on('submit', function(e){
    e.preventDefault();
    var contact = $(this).serialize();
    ContactServer.add(contact);
    Display.clearForm('add-new');
  });

  // B/C buttons are dynamically generated and do not exist at document.ready
  $('ul#contacts').on('click','button.detail', function(){
    // parent() should also work
    var id = $(this).closest('li').attr('id');
    Display.toggleDetail(id);
  });

  $('ul#contacts').on('click','button.delete', function(){
    ContactServer.remove($(this).closest('li').attr('id'));
  });

  $('ul#contacts').on('click','button.edit', function(){
    var id = $(this).closest('li').attr('id');
    Display.editForm(id);
  });

  $('#edit').on('submit',function(e){
    e.preventDefault();
  });

});
