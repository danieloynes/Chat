// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    orderBy, 
    onSnapshot, 
    serverTimestamp, 
    query 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnmyl5qf5K0Bg3RtFWOysnpUNZoBeUcP4",
    authDomain: "chat-271c7.firebaseapp.com",
    projectId: "chat-271c7",
    storageBucket: "chat-271c7.firebasestorage.app",
    messagingSenderId: "1049166101019",
    appId: "1:1049166101019:web:e43316664b9a39ede916be",
    measurementId: "G-415KJHFRYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages-container');
const userEmailDisplay = document.getElementById('user-email');
const themeToggle = document.getElementById('theme-toggle');

// Current user
let currentUser = null;
let messageBeingEdited = null;

// Theme Management
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // Store preference
    localStorage.setItem('darkMode', isDarkMode);
});

// Load theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Authentication Functions
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert('Vennligst fyll ut både e-post og passord.');
        return;
    }
    
    signInWithEmailAndPassword(auth, email, password)
        .catch(error => {
            alert(`Innloggingsfeil: ${error.message}`);
        });
});

signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert('Vennligst fyll ut både e-post og passord.');
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
        .catch(error => {
            alert(`Registreringsfeil: ${error.message}`);
        });
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Auth state observer
onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        userEmailDisplay.textContent = user.email;
        authContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        loadMessages();
    } else {
        currentUser = null;
        authContainer.classList.remove('hidden');
        chatContainer.classList.add('hidden');
        emailInput.value = '';
        passwordInput.value = '';
    }
});

// Message Functions
function loadMessages() {
    messagesContainer.innerHTML = '';
    
    // Create a query to order messages by timestamp
    const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('timestamp', 'asc')
    );
    
    // Listen for new messages in real-time
    onSnapshot(messagesQuery, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                displayMessage(change.doc.id, change.doc.data());
            } else if (change.type === 'modified') {
                // Update modified message
                const messageElement = document.getElementById(`message-${change.doc.id}`);
                if (messageElement) {
                    const messageData = change.doc.data();
                    const contentElement = messageElement.querySelector('.message-content');
                    contentElement.textContent = messageData.text;
                }
            } else if (change.type === 'removed') {
                // Remove deleted message
                const messageElement = document.getElementById(`message-${change.doc.id}`);
                if (messageElement) {
                    messageElement.remove();
                }
            }
        });
        
        // Scroll to bottom after all messages are loaded
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

function displayMessage(id, messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.id = `message-${id}`;
    messageDiv.className = 'message';
    
    // Check if message is from current user
    const isSentByCurrentUser = messageData.userId === currentUser.uid;
    messageDiv.classList.add(isSentByCurrentUser ? 'sent' : 'received');
    
    // Create message content
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = messageData.text;
    messageDiv.appendChild(contentElement);
    
    // Add timestamp
    if (messageData.timestamp) {
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        
        // Format timestamp
        const date = messageData.timestamp.toDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
        
        messageDiv.appendChild(timeElement);
    }
    
    // Add edit/delete options if message is from current user
    if (isSentByCurrentUser) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'message-options';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => startEditingMessage(id, messageData.text));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteMessage(id));
        
        optionsDiv.appendChild(editBtn);
        optionsDiv.appendChild(deleteBtn);
        messageDiv.appendChild(optionsDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (!messageText) {
        return; // Prevent sending empty messages
    }
    
    if (messageBeingEdited) {
        // Update existing message
        const messageRef = doc(db, 'messages', messageBeingEdited);
        updateDoc(messageRef, {
            text: messageText,
            edited: true
        })
        .then(() => {
            messageBeingEdited = null;
            messageInput.value = '';
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        })
        .catch(error => {
            console.error("Error updating message: ", error);
            alert("Kunne ikke oppdatere meldingen");
        });
    } else {
        // Create new message
        addDoc(collection(db, 'messages'), {
            text: messageText,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            timestamp: serverTimestamp()
        })
        .then(() => {
            messageInput.value = '';
        })
        .catch(error => {
            console.error("Error sending message: ", error);
            alert("Kunne ikke sende meldingen");
        });
    }
}

function startEditingMessage(id, text) {
    messageBeingEdited = id;
    messageInput.value = text;
    messageInput.focus();
    sendBtn.innerHTML = '<i class="fas fa-check"></i>';
}

function deleteMessage(id) {
    if (confirm('Er du sikker på at du vil slette denne meldingen?')) {
        const messageRef = doc(db, 'messages', id);
        deleteDoc(messageRef)
            .catch(error => {
                console.error("Error deleting message: ", error);
                alert("Kunne ikke slette meldingen");
            });
    }
}

// Send message when button is clicked
sendBtn.addEventListener('click', sendMessage);

// Send message when Enter key is pressed
messageInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});