const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Base de données simulée
const users = [
  { id: 1, username: 'alice', password: 'alice123', role: 'admin', email: 'alice@example.com' },
  { id: 2, username: 'bob', password: 'bob456', role: 'user', email: 'bob@example.com' },
];
const notes = [
  { id: 1, userId: 1, content: "Note secrète d'alice", private: true },
  { id: 2, userId: 2, content: 'Note de bob', private: false },
];

// Route de connexion
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username == username && u.password == password);
  if (user) {
    res.json({ success: true, token: Buffer.from(JSON.stringify(user)).toString('base64'), user });
  } else {
    res.status(401).json({ error: 'Echec authentification' });
  }
});

// Route pour obtenir une note par ID
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const note = notes.find(n => n.id == noteId);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: 'Note non trouvée' });
  }
});

// Route pour créer une note
app.post('/notes', (req, res) => {
  const { userId, content } = req.body;
  const newNote = { id: notes.length + 1, userId, content, private: false };
  notes.push(newNote);
  res.json({ success: true, note: newNote });
});

// Route de recherche
app.get('/search', (req, res) => {
  const query = req.query.q;
  const results = notes.filter(n => n.content.includes(query));
  res.json({ results, debug: `SELECT * FROM notes WHERE content LIKE '%${query}%'` });
});

// Route d'administration
app.get('/admin/users', (req, res) => {
  res.json({ users });
});

app.listen(3000, () => console.log('App vulnérable démarrée sur le port 3000'));
