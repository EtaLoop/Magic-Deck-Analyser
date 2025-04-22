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
                image TEXT NOT NULL,
                type TEXT NOT NULL
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
export const addCard = (name: string, image: string, type: string): number | null => {
    try {
        db.runSync('INSERT INTO Card (name, image, type) VALUES (?, ?, ?)', [name, image, type]);

        const result = db.getFirstSync<{ id: number }>('SELECT last_insert_rowid() as id');

        const newId = result?.id ?? null;
        console.log("✅ Carte ajoutée :", name, "avec image :", image, "- ID :", newId);
        return newId;
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la carte", error);
        return null;
    }
};

export const addDeck = (name: string) => {
    try {
        db.runSync('INSERT INTO Deck (name) VALUES (?)', [name]);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du deck", error);
        return null;
    }
};




export const addLinkDeckCard = (idDeck: number, idCard: number) => {
    if (!idDeck || !idCard) {
        console.error("❌ L'un des ID est invalide : deckId ou cardId est manquant.");
        return;
    }

    try {
        // Insérer le lien entre le deck et la carte dans la table Deck_Card
        db.runSync(
            'INSERT INTO Deck_Card (deckId, cardId) VALUES (?, ?)',
            [idDeck, idCard]
        );
        console.log(`✅ Lien (deck: ${idDeck}, carte: ${idCard}) ajouté ou déjà existant`);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du lien entre le deck et la carte", error);
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


export const getDecks = (): any[] => {
    try {
        const result = db.getAllSync('SELECT * FROM Deck');
        console.log("✅ Cartes récupérées :", result);
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des cartes", error);
        return [];
    }
};


export const getCardByName = (name: string): any | null => {
    try {
        const result = db.getFirstSync('SELECT * FROM Card WHERE name = ?', [name]);
        return result || null;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération de la carte par nom :", error);
        return null;
    }
};


export const getCardsByDeckId = (deckId: number): any[] => {
    try {
        const result = db.getAllSync(
            `SELECT Card.* 
             FROM Card 
             JOIN Deck_Card ON Card.id = Deck_Card.cardId 
             WHERE Deck_Card.deckId = ?`,
            [deckId]
        );
        return result;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des cartes du deck :", error);
        return [];
    }
};



