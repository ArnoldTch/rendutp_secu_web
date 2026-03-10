const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());

const SECRET = "super_secret_key";

// Base de données simulée
const users = [
  {
    id: 1,
    username: "alice",
    password: bcrypt.hashSync("alice123", 10),
    role: "admin",
    email: "alice@example.com"
  },
  {
    id: 2,
    username: "bob",
    password: bcrypt.hashSync("bob456", 10),
    role: "user",
    email: "bob@example.com"
  }
];

const notes = [
  { id: 1, userId: 1, content: "Note secrète d'alice", private: true },
  { id: 2, userId: 2, content: "Note de bob", private: false }
];


// Middleware authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requis" });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
}


// Middleware admin
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
}


// Route de connexion sécurisée
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Lire une note (contrôle d'accès)
app.get("/notes/:id", authenticateToken, (req, res) => {
  try {
    const noteId = parseInt(req.params.id);

    const note = notes.find(n => n.id === noteId);

    if (!note) {
      return res.status(404).json({ error: "Note non trouvée" });
    }

    if (note.private && note.userId !== req.user.id) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    res.json(note);

  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Création de note sécurisée
app.post("/notes", authenticateToken, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.length > 500) {
      return res.status(400).json({ error: "Contenu invalide" });
    }

    const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const newNote = {
      id: notes.length + 1,
      userId: req.user.id,
      content: sanitizedContent,
      private: false
    };

    notes.push(newNote);

    res.json({ success: true, note: newNote });

  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Recherche sécurisée
app.get("/search", authenticateToken, (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: "Paramètre q requis" });
    }

    const results = notes.filter(n =>
      n.content.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ results });

  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Route admin sécurisée
app.get("/admin/users", authenticateToken, requireAdmin, (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role
  }));

  res.json({ users: safeUsers });
});


// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});


app.listen(3000, () => {
  console.log("API sécurisée lancée sur le port 3000");
});