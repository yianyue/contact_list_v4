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
        $('.collapsible').collapsible();
        // to work with materialize's collapsible content.
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

  // Mustache
  $("#contact-form").load("template #form-tmp",function(){
    var template = $('#form-tmp').html();
    var output = Mustache.render(template);
    $(this).html(output);
  });

  // display all contacts on load
  ContactServer.getAll();

  // listeners
  $('#add-btn').on('click', function(){
    $("#contact-form").toggle();
  });

  $('#contact-form').on('submit', function(e){
    e.preventDefault();
    var $form = $(this).find('form');
    var contact = $form.serialize();
    ContactServer.add(contact);
    Display.clearForm($form);
    $(this).toggle();
  });

  $('#edit').on('submit',function(e){
    e.preventDefault();
    var contact = $(this).serialize();
    var id = $(this).closest('li').attr('id');
    ContactServer.update(id, contact);
    $(this).toggle();
  });

  // Listeners for actions on each contact
  // these elements are dynamically generated and do not exist at document.ready

  $('#contact-list').on('click','a.delete', function(e){
    e.preventDefault();
    var item = $(this).closest('li');
    ContactServer.remove(item.attr('id'));
    // Display.remove should only be called upon success
    Display.remove(item);
  });

  // $('#contact-list').on('click','button.edit', function(){
  //   var item = $(this).closest('li');
  //   Display.editForm(item);
  // });

});
