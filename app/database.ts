import * as SQLite from 'expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

// Ouvre la base de données en mode synchrone
const db = openDatabaseSync('cards.db');

// Initialisation de la base de données
export const setupDatabase = () => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS Deck (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS Card (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                image TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS Deck_Card (
                deckId INTEGER NOT NULL,
                cardId INTEGER NOT NULL,
                PRIMARY KEY (deckId, cardId),
                FOREIGN KEY (deckId) REFERENCES Deck(id) ON DELETE CASCADE,
                FOREIGN KEY (cardId) REFERENCES Card(id) ON DELETE CASCADE
            );
        `);
        console.log("✅ Tables créées avec succès");
    } catch (error) {
        console.error("❌ Erreur lors de la création des tables :", error);
    }
};

export const clearDatabase = () => {
    try {
        db.execSync(`
            DROP TABLE IF EXISTS Deck_Card;
            DROP TABLE IF EXISTS Card;
            DROP TABLE IF EXISTS Deck;
        `);
        console.log("✅ Toutes les tables ont été supprimées avec succès");
    } catch (error) {
        console.error("❌ Erreur lors de la suppression des tables", error);
    }
};



// Ajouter une carte (Synchronisé)
export const addCard = (name: string, image: string) => {
    try {
        db.runSync('INSERT INTO Card (name, image) VALUES (?, ?)', [name, image]);
        console.log("✅ Carte ajoutée :", name, "avec image :", image);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la carte", error);
    }
};


// Récupérer les cartes (Synchronisé)
export const getCards = (): any[] => {
    try {
        const result = db.getAllSync('SELECT * FROM Card');
        console.log("✅ Cartes récupérées :", result);
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des cartes", error);
        return [];
    }
};
