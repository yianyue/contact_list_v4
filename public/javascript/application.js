
$(document).ready(function() {
  // ajax requests
  var ContactServer = {
    getAll: function(){
      $.ajax({
        method: "GET",
        url: "/contacts",
        dataType: 'json'
      }).done(ClientData.addAll)        
    },

    add: function(contact){
      $.ajax({
        method: "POST",
        url: "/contacts",
        dataType: 'json',
        data: contact
      }).done(ClientData.add)
        .fail(Display.err);
    },

    remove: function(id){
      $.ajax({
        method: "DELETE",
        url: "/contacts/"+id,
      }).done(ClientData.remove);
    },

    update: function(contact){
      $.ajax({
        method: "PUT",
        url: "/contacts",
        dataType: 'json',
        data: contact
      }).done(ClientData.update)
        .fail(Display.err);
    }

  }

  // storing data on client side
  var ClientData = {
    localData: {},
    add: function(contact){
      ClientData.localData[contact.id] = contact;
      Display.add(contact);
    },
    addAll: function(contacts){
      $.each(contacts,function(i, contact){
        ClientData.add(contact);
      });
    },
    remove: function(id){
      delete ClientData.localData[id];
    },
    update: function(contact){
      ClientData.localData[contact.id] = contact;
      Display.update(contact);
    },
    getById: function(id){
      return ClientData.localData[id];
    }
  }

  // DOM manipulations
  var Display = {

    add: function(contact){
      $('#contact-form').closeModal();
      var template = $('#contact-tmp').html();
      var output = Mustache.render(template, contact);
      $('#contact-list').append(output);
      // to work with materialize's js.
      $('.collapsible').collapsible();
      // TODO: create an initial load function; this message is only when a new contact is added.
      Materialize.toast(contact.first_name + ' is on the list!', 5000);
    },

    err: function(errors){
      var $form = $('#contact-form form');
      var inputs = $form.find(':input');
      $.each(inputs, function(i, input){
        if (errors.responseJSON[input.id]){          
          $label = $('label[for="'+$(input).attr('id')+'"]');
          $label.after(errors.responseJSON[input.id]);
        }
      });
    },

    toggleDetail: function(item){
      item.find('div.detail').toggle();
    },

    update: function(contact){
      $('#contact-form').closeModal();
      var $item = $('#'+contact.id);
      // get at the elements inside li
      var template = $($('#contact-tmp').html()).html();
      var output = Mustache.render(template, contact);
      $item.html(output);
      // Can just the text be swapped out?
      $('.collapsible').collapsible();
      Materialize.toast(contact.first_name + '\'s info has been updated!', 5000);
    },

    remove: function(item){
      item.remove();
      Materialize.toast('<span>Item Deleted</span><a class=&quot;btn-flat yellow-text&quot; href=&quot;#!&quot;>Undo<a>', 5000);
    },

    clearForm: function(){
      $form = $('#contact-form form');
      $form.each(function(){
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
  
  // display all contacts on load
  ContactServer.getAll();

  // listeners
  // openning form in a modal with materialize
  $('#add-btn').on('click', function(e){
    e.preventDefault();
    var $modal = $('#contact-form');
    var $form = $('#contact-form form');
    $form.attr('class', 'add-contact-form');
    $form.find('h3').text('Add a New Contact');
    Display.clearForm();
    $modal.openModal();
  });

  // Listeners for actions on each contact
  // these elements are dynamically generated and do not exist at document.ready

  // edit a contact
  $('#contact-list').on('click','a.edit', function(e){
    e.preventDefault();    
    var id = $(this).closest('li').attr('id');
    var $modal = $('#contact-form');
    var $form = $modal.find('form');
    $form.attr('class', 'edit-contact-form');
    $form.find('h3').text('Edit Contact');
    var contact = ClientData.getById(id);
    // pass the contact id to a hidden field on the form for edit submission
    $form.find('#id').val(id);
    Display.populateFrom($form, contact);
    $modal.openModal();
  });

  // delete a contact
  $('#contact-list').on('click','a.delete', function(e){
    e.preventDefault();
    var $item = $(this).closest('li');
    // TODO: alert user
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
    if ($form.attr('class') == 'add-contact-form'){
      ContactServer.add(contact);
    } else {
      ContactServer.update(contact);    
    }    
  });

});
