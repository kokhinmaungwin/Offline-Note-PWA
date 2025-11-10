const noteInput = document.getElementById('noteInput');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const notesList = document.getElementById('notesList');

let notes = [];

// Load notes from localStorage
function loadNotes() {
  const saved = localStorage.getItem('notes');
  if(saved) {
    notes = JSON.parse(saved);
  } else {
    notes = [];
  }
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render notes list
function renderNotes() {
  notesList.innerHTML = '';
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    li.textContent = note;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'deleteBtn';
    delBtn.onclick = () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    };

    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Save button click handler
saveNoteBtn.addEventListener('click', () => {
  const text = noteInput.value.trim();
  if(text.length === 0) return alert('Please write something!');

  notes.push(text);
  saveNotes();
  renderNotes();
  noteInput.value = '';
});

// Initialize
loadNotes();
renderNotes();

// Register service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(() => console.log('Service Worker Registration Failed'));
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to the install prompt:', outcome);
    deferredPrompt = null;
  }
});
