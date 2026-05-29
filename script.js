const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT.firebaseapp.com",

  databaseURL: "YOUR_DATABASE_URL",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_PROJECT.appspot.com",

  messagingSenderId: "YOUR_ID",

  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const storage = firebase.storage();

let currentRoom = "main";

function joinRoom() {

  currentRoom =
    document.getElementById("roomInput").value;

  document.getElementById("messages").innerHTML = "";

  loadMessages();
}

function sendMessage() {

  const username =
    document.getElementById("username").value;

  const text =
    document.getElementById("messageInput").value;

  const imageFile =
    document.getElementById("imageUpload").files[0];

  if (imageFile) {

    const storageRef =
      storage.ref("images/" + imageFile.name);

    storageRef.put(imageFile).then(() => {

      storageRef.getDownloadURL().then((url) => {

        db.ref("rooms/" + currentRoom).push({

          username,
          text,
          image: url
        });
      });
    });

  } else {

    db.ref("rooms/" + currentRoom).push({

      username,
      text
    });
  }

  document.getElementById("messageInput").value = "";
}

function loadMessages() {

  db.ref("rooms/" + currentRoom)
  .on("child_added", snapshot => {

    const data = snapshot.val();

    const div =
      document.createElement("div");

    div.classList.add("message");

    div.innerHTML =
      `<b>${data.username}</b><br>${data.text || ""}`;

    if (data.image) {

      div.innerHTML +=
        `<img src="${data.image}">`;
    }

    document
      .getElementById("messages")
      .appendChild(div);

    const messages =
      document.getElementById("messages");

    messages.scrollTop =
      messages.scrollHeight;
  });
}

loadMessages();
