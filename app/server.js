const express = require('express');
const LiteSQL = require('better-sqlite3');
const cors = require('cors'); // Ajout de CORS pour éviter les erreurs
const db = new LiteSQL('database.db');

const app = express();
app.use(express.json());
app.use(cors()); // Active CORS

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Deck (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS Card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS Deck_Card (
    deckId INTEGER,
    cardId INTEGER,
    PRIMARY KEY (deckId, cardId),
    FOREIGN KEY (deckId) REFERENCES Deck(id) ON DELETE CASCADE,
    FOREIGN KEY (cardId) REFERENCES Card(id) ON DELETE CASCADE
  );
`);

// Route pour ajouter un deck
app.post('/decks', (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare('INSERT INTO Deck (name) VALUES (?)');
  const result = stmt.run(name);
  res.json({ id: result.lastInsertRowid, name });
});

// Route pour ajouter une carte
app.post('/cards', (req, res) => {
  const { name } = req.body;
  const stmt = db.prepare('INSERT INTO Card (name) VALUES (?)');
  const result = stmt.run(name);
  res.json({ id: result.lastInsertRowid, name });
});

// Route pour récupérer les cartes
app.get('/cards', (req, res) => {
  const stmt = db.prepare('SELECT * FROM Card');
  const cards = stmt.all();
  res.json(cards);
});

// Route pour ajouter une carte à un deck
app.post('/decks/:deckId/cards/:cardId', (req, res) => {
  const { deckId, cardId } = req.params;
  const stmt = db.prepare('INSERT INTO Deck_Card (deckId, cardId) VALUES (?, ?)');
  stmt.run(deckId, cardId);
  res.json({ message: 'Card added to deck' });
});

// Lancer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
