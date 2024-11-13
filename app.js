const firebaseConfig = {
    apiKey: "AIzaSyBqS8s6D9U2q1UNsmBfbu_nazvM2uu62Zk",
    authDomain: "todoappproject-9.firebaseapp.com",
    databaseURL: "https://todoappproject-9-default-rtdb.firebaseio.com",
    projectId: "todoappproject-9",
    storageBucket: "todoappproject-9.appspot.com",
    messagingSenderId: "300499331472",
    appId: "1:300499331472:web:c5bcc4d608c9478df5eb15"
  };
  
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  // UI Elements
  const authContainer = document.getElementById("auth-container");
  const todoContainer = document.getElementById("todo-container");
  const todoInput = document.getElementById("todoInput");
  const ulElement = document.getElementById("list");
  const authError = document.getElementById("auth-error");
  
  // Firebase Authentication - Sign Up
  function signUp() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // User signed up successfully
              const user = userCredential.user;
              console.log("User signed up: ", user);
              authContainer.style.display = "none";
              todoContainer.style.display = "block";
              loadTodos(user.uid);
          })
          .catch((error) => {
              authError.textContent = error.message;
          });
  }
  
  // Firebase Authentication - Login
  function login() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // User logged in successfully
              const user = userCredential.user;
              console.log("User logged in: ", user);
              authContainer.style.display = "none";
              todoContainer.style.display = "block";
              loadTodos(user.uid);
          })
          .catch((error) => {
              authError.textContent = error.message;
          });
  }
  
  // Sign-out function
  function signOut() {
      auth.signOut().then(() => {
          authContainer.style.display = "block";
          todoContainer.style.display = "none";
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";
          ulElement.innerHTML = "";
      }).catch((error) => {
          console.error("Error signing out: ", error);
      });
  }
  
  // Add Todo item
  function addTodo() {
      const user = auth.currentUser;
      const todoText = todoInput.value.trim();
  
      if (todoText && user) {
          const key = db.ref("todos").push().key;
          const todoObj = {
              value: todoText,
              key: key,
              userId: user.uid
          };
          db.ref("todos").child(key).set(todoObj);
          todoInput.value = "";
      }
  }
  
  // Load todos for the authenticated user
  function loadTodos(userId) {
      db.ref("todos").orderByChild("userId").equalTo(userId).on("child_added", (data) => {
          const liElement = document.createElement("li");
          const liText = document.createTextNode(data.val().value);
          liElement.appendChild(liText);
          ulElement.appendChild(liElement);
  
          const delBtnElement = document.createElement("button");
          const delBtnText = document.createTextNode("Delete");
          delBtnElement.appendChild(delBtnText);
          liElement.appendChild(delBtnElement);
          delBtnElement.setAttribute("id", data.val().key);
          delBtnElement.setAttribute("onclick", "deleteSingleItem(this)");
          delBtnElement.classList.add("del-btn");
  
          const editBtnElement = document.createElement("button");
          const editBtnText = document.createTextNode("Edit");
          editBtnElement.appendChild(editBtnText);
          editBtnElement.setAttribute("onclick", "editItem(this)");
          editBtnElement.setAttribute("id", data.val().key);
          liElement.appendChild(editBtnElement);
          editBtnElement.classList.add("edit-btn");
      });
  }
  
  // Delete single todo item
  function deleteSingleItem(e) {
      db.ref("todos").child(e.id).remove();
      e.parentNode.remove();
  }
  
  // Edit todo item
  function editItem(e) {
      const updatedVal = prompt("Enter updated value...");
      const editTodo = {
          value: updatedVal,
          key: e.id
      };
      db.ref("todos").child(e.id).set(editTodo);
      e.parentNode.firstChild.nodeValue = updatedVal;
  }
  
  