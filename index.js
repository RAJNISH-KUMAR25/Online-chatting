window.onload = function() {
  var firebaseConfig = {
    apiKey: "AIzaSyBJ6xwOOthBoScVf7hb_Q3Xg-lh-066S3A",
    authDomain: "memechat2-d6596.firebaseapp.com",
    databaseURL: "https://memechat2-d6596-default-rtdb.firebaseio.com",
    projectId: "memechat2-d6596",
    storageBucket: "memechat2-d6596.appspot.com",
    messagingSenderId: "855960020684",
    appId: "1:855960020684:web:4ee99873dae3c665384469"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database()
  class MEME_CHAT{
    home(){
      document.body.innerHTML = ''
      this.create_title()
      this.create_join_form()
    }
    chat(){
      this.create_title()
      this.create_chat()
    }
    create_title(){
      var title_container = document.createElement('div')
      title_container.setAttribute('id', 'title_container')
      var title_inner_container = document.createElement('div')
      title_inner_container.setAttribute('id', 'title_inner_container')

      var title = document.createElement('h1')
      title.setAttribute('id', 'title')
      title.textContent = 'Online chat website'

      title_inner_container.append(title)
      title_container.append(title_inner_container)
      document.body.append(title_container)
    }
    create_join_form(){
      var parent = this;
      var join_container = document.createElement('div')
      join_container.setAttribute('id', 'join_container')
      var join_inner_container = document.createElement('div')
      join_inner_container.setAttribute('id', 'join_inner_container')
      var join_button_container = document.createElement('div')
      join_button_container.setAttribute('id', 'join_button_container')
      var join_button = document.createElement('button')
      join_button.setAttribute('id', 'join_button')
      join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>'
      var join_input_container = document.createElement('div')
      join_input_container.setAttribute('id', 'join_input_container')
      var join_input = document.createElement('input')
      join_input.setAttribute('id', 'join_input')
      join_input.setAttribute('maxlength', 15)
      join_input.placeholder = 'Welcome to chating web'
      join_input.onkeyup  = function(){
        if(join_input.value.length > 0){
          join_button.classList.add('enabled')
          join_button.onclick = function(){
            // Save the name to local storage. Passing in
            parent.save_name(join_input.value)
            // Remove the join_container. So the site doesn't look weird.
            join_container.remove()
            // parent = this. But it is not the join_button
            parent.create_chat()
          }
        }else{
          join_button.classList.remove('enabled')
        }
      }
      join_button_container.append(join_button)
      join_input_container.append(join_input)
      join_inner_container.append(join_input_container, join_button_container)
      join_container.append(join_inner_container)
      document.body.append(join_container)
    }
    create_load(container_id){
      var parent = this;
      var container = document.getElementById(container_id)
      container.innerHTML = ''
      var loader_container = document.createElement('div')
      loader_container.setAttribute('class', 'loader_container')
      var loader = document.createElement('div')
      loader.setAttribute('class', 'loader')
      loader_container.append(loader)
      container.append(loader_container)
    }
    create_chat(){
      var parent = this;
      var title_container = document.getElementById('title_container')
      var title = document.getElementById('title')
      title_container.classList.add('chat_title_container')
      title.classList.add('chat_title')
      var chat_container = document.createElement('div')
      chat_container.setAttribute('id', 'chat_container')
      var chat_inner_container = document.createElement('div')
      chat_inner_container.setAttribute('id', 'chat_inner_container')
      var chat_content_container = document.createElement('div')
      chat_content_container.setAttribute('id', 'chat_content_container')
      var chat_input_container = document.createElement('div')
      chat_input_container.setAttribute('id', 'chat_input_container')
      var chat_input_send = document.createElement('button')
      chat_input_send.setAttribute('id', 'chat_input_send')
      chat_input_send.setAttribute('disabled', true)
      chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`
      var chat_input = document.createElement('input')
      chat_input.setAttribute('id', 'chat_input')
      // Only a max message length of 1000
      chat_input.setAttribute('maxlength', 1000)
      // Get the name of the user
      chat_input.placeholder = `${parent.get_name()}. Say something...`
      chat_input.onkeyup  = function(){
        if(chat_input.value.length > 0){
          chat_input_send.removeAttribute('disabled')
          chat_input_send.classList.add('enabled')
          chat_input_send.onclick = function(){
            chat_input_send.setAttribute('disabled', true)
            chat_input_send.classList.remove('enabled')
            if(chat_input.value.length <= 0){
              return
            }
            // Enable the loading circle in the 'chat_content_container'
            parent.create_load('chat_content_container')
            parent.send_message(chat_input.value)
            // Clear the chat input box
            chat_input.value = ''
            chat_input.focus()
          }
        }else{
          chat_input_send.classList.remove('enabled')
        }
      }

      var chat_logout_container = document.createElement('div')
      chat_logout_container.setAttribute('id', 'chat_logout_container')

      var chat_logout = document.createElement('button')
      chat_logout.setAttribute('id', 'chat_logout')
      chat_logout.textContent = `${parent.get_name()} • logout`
      chat_logout.onclick = function(){
        localStorage.clear()
        // Go back to home page
        parent.home()
      }
      chat_logout_container.append(chat_logout)
      chat_input_container.append(chat_input, chat_input_send)
      chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container)
      chat_container.append(chat_inner_container)
      document.body.append(chat_container)
      parent.create_load('chat_content_container')
      parent.refresh_chat()
    }
    save_name(name){
      // Save name to localStorage
      localStorage.setItem('name', name)
    }
    // Sends message/saves the message to firebase database
    send_message(message){
      var parent = this
      if(parent.get_name() == null && message == null){
        return
      }
      db.ref('chats/').once('value', function(message_object) {
        var index = parseFloat(message_object.numChildren()) + 1
        db.ref('chats/' + `message_${index}`).set({
          name: parent.get_name(),
          message: message,
          index: index
        })
        .then(function(){
          parent.refresh_chat()
        })
      })
    }
    get_name(){
      // Get the name from localstorage
      if(localStorage.getItem('name') != null){
        return localStorage.getItem('name')
      }else{
        this.home()
        return null
      }
    }
    // Refresh chat gets the message/chat data from firebase
    refresh_chat(){
      var chat_content_container = document.getElementById('chat_content_container')
      // Get the chats from firebase
      db.ref('chats/').on('value', function(messages_object) {
        chat_content_container.innerHTML = ''
        if(messages_object.numChildren() == 0){
          return
        }
        var messages = Object.values(messages_object.val());
        var guide = [] 
        var unordered = []
        var ordered = [] 

        for (var i, i = 0; i < messages.length; i++) {
          guide.push(i+1)
          unordered.push([messages[i], messages[i].index]);
        }
        guide.forEach(function(key) {
          var found = false
          unordered = unordered.filter(function(item) {
            if(!found && item[1] == key) {
              ordered.push(item[0])
              found = true
              return false
            }else{
              return true
            }
          })
        })
        ordered.forEach(function(data) {
          var name = data.name
          var message = data.message
          var message_container = document.createElement('div')
          message_container.setAttribute('class', 'message_container')
          var message_inner_container = document.createElement('div')
          message_inner_container.setAttribute('class', 'message_inner_container')
          var message_user_container = document.createElement('div')
          message_user_container.setAttribute('class', 'message_user_container')
          var message_user = document.createElement('p')
          message_user.setAttribute('class', 'message_user')
          message_user.textContent = `${name}`
          var message_content_container = document.createElement('div')
          message_content_container.setAttribute('class', 'message_content_container')
          var message_content = document.createElement('p')
          message_content.setAttribute('class', 'message_content')
          message_content.textContent = `${message}`
          message_user_container.append(message_user)
          message_content_container.append(message_content)
          message_inner_container.append(message_user_container, message_content_container)
          message_container.append(message_inner_container)
          chat_content_container.append(message_container)
        });
        chat_content_container.scrollTop = chat_content_container.scrollHeight;
    })
    }
  }
  var app = new MEME_CHAT()
  if(app.get_name() != null){
    app.chat()
  }
}
