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
        // Display.remove should be here
      });
    },

    update: function(id, contact){
      $.ajax({
        method: "PUT",
        url: "/contacts/"+id,
        dataType: 'json',
        data: contact
      }).done(function(response){
        Display.update(response);
      });
    }

  }

  // storing data on client side
  var ClientData = {
    localData: {},
    add: function(contact){
      this.localData[contact.id] = contact;
    },
    addAll: function(contacts){
      $.each(contacts,function(i, contact){
        ClientData.add(contact);
        Display.add(contact);
      });
    },
    remove: function(id){
      delete this.localData[id];
    },
    getById: function(id){
      return this.localData[id];
    }
  }

  // DOM manipulations
  var Display = {
    appendToList: function(item, contact){
      item.append(contact.first_name+" "+contact.last_name)
      .append("<button class='detail'>detail</button>")
      .append("<button class='delete'>delete</button>")
      .append("<button class='edit'>edit</button>")
      .append('<div class="detail">'+contact.email+'</div>');
      item.find('div.detail').hide();
    },

    add: function(contact){
      $('#contacts').append('<li class="contact" id="'+contact.id+'"></li>');
      var item = $('#'+contact.id);
      this.appendToList(item, contact);
    },

    toggleDetail: function(item){
      item.find('div.detail').toggle();
    },

    update: function(contact){
      var item = $('#'+contact.id);
      item.empty();
      this.appendToList(item, contact);
    },

    remove: function(item){
      item.remove();
    },

    clearForm: function(form){
      form.each(function(){
          this.reset();
      }); 
    },

    editForm: function(item){
      var contact = ClientData.getById(item.attr('id'));
      var form = $('form#edit');
      form.detach();
      item.append(form);
      form.toggle();
      this.populateFrom(form, contact);
    },

    populateFrom: function(form, contact){
      var inputs = form.find(':input');
      $.each(inputs, function(i, input){
        if (input.type == 'text'){
          // TODO: there's gotta be a better way
          input.value = contact[input.name.split('[')[1].split(']')[0]];
        }
      });
    }
  }

  // display all contacts and hide edit form on load
  ContactServer.getAll();
  $('#edit').hide();

  // submit forms
  $('#add-new').on('submit', function(e){
    e.preventDefault();
    var contact = $(this).serialize();
    ContactServer.add(contact);
    Display.clearForm($(this));
  });

  $('#edit').on('submit',function(e){
    e.preventDefault();
    var contact = $(this).serialize();
    var id = $(this).closest('li').attr('id');
    ContactServer.update(id, contact);
    $(this).toggle();
  });

  // button click events
  // B/C buttons are dynamically generated and do not exist at document.ready
  $('ul#contacts').on('click','button.detail', function(){
    // parent() should also work
    var item = $(this).closest('li');
    Display.toggleDetail(item);
  });

  $('ul#contacts').on('click','button.delete', function(){
    var item = $(this).closest('li');
    ContactServer.remove(item.attr('id'));
    // Display.remove should only be called upon success
    Display.remove(item);
  });

  $('ul#contacts').on('click','button.edit', function(){
    var item = $(this).closest('li');
    Display.editForm(item);
  });

});
