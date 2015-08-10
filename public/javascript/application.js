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
      Display.add(contact);
    },
    addAll: function(contacts){
      $.each(contacts,function(i, contact){
        ClientData.add(contact);
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

    add: function(contact){
      $.get( "/template", function(template, textStatus, jqXhr) {
        var tmp = $(template).filter('#contact-tmp').html();
        var output = Mustache.render(tmp, contact);
        $('#contact-list').append(output);
        // to work with materialize's js.
        $('.collapsible').collapsible();
      });
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

    populateFrom: function($form, contact){
      var inputs = $form.find(':input');
      $.each(inputs, function(i, input){
        if (input.type == 'text'){
          // TODO: there's gotta be a better way
          input.value = contact[input.name.split('[')[1].split(']')[0]];
        }
      });
    }
  }
  
  // using modal window for form
  // display all contacts on load
  ContactServer.getAll();

  // listeners
  // openning form in a modal with materialize
  $('#add-btn').on('click', function(e){
    e.preventDefault();
    var $modal = $('#contact-form');
    var $form = $('#contact-form form');
    $form.attr('id', 'add-contact-form');
    $form.find('h3').text('Add a New Contact');
    $modal.openModal();
  });

  // Listeners for actions on each contact
  // these elements are dynamically generated and do not exist at document.ready
  $('#contact-list').on('click','a.edit', function(e){
    e.preventDefault();
    var $item = $(this).closest('li');
    var $modal = $('#contact-form');
    var $form = $('#contact-form form');
    $form.attr('id', 'edit-contact-form');
    $form.find('h3').text('Edit Contact');
    var contact = ClientData.getById($item.attr('id'));
    Display.populateFrom($form, contact);
    $modal.openModal();
  });

  $('#contact-list').on('click','a.delete', function(e){
    e.preventDefault();
    var $item = $(this).closest('li');
    ContactServer.remove($item.attr('id'));
    // TODO: add item back if delete fails
    Display.remove($item);
  });

  // form (add/edit) submission
  $('#contact-form').on('submit', function(e){
    e.preventDefault();
    var $form = $(this).find('form');
    // dot notation doesn't work with serialized data
    var contact = $form.serialize();
    debugger;
    if ($form.attr('id') == 'add-contact-form'){
      ContactServer.add(contact);
    } else {
      // no access to id since it's a modal window...
      // ContactServer.update(id, contact);    
    }
    $(this).closeModal();
    Display.clearForm($form);
  });

});
