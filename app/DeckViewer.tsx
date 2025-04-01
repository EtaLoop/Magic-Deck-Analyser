import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View, Button } from 'react-native';
import { setupDatabase, getCards, addCard } from './database'; // Importe la DB locale
import { Link } from 'expo-router';

interface Card {
    id: number;  // Assurez-vous que `id` correspond bien à l'int SQL
    name: string;
}

const CardViewer = () => {
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        setupDatabase(); // Initialisation unique de la DB
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const data = await getCards(); // On attend que `getCards` retourne les données
            setCards(data);
        } catch (error) {
            console.error("Erreur lors du chargement des cartes :", error);
        }
    };

    const handleAddCard = async () => {
        await addCard('Nouvelle carte'); // Ajoute une carte
        loadCards(); // Recharge la liste après l'ajout
    };

    const renderItem = ({ item }: { item: Card }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Link href="/deck_menu">
                <Button title="Ajouter une carte" />
            </Link>
            <FlatList
                data={cards}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()} // Convertir en string si nécessaire
                numColumns={4}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0', padding: 16 },
    card: { 
        backgroundColor: '#ff4d4d', 
        padding: 16, 
        margin: 8, 
        borderRadius: 8, 
        flex: 1, 
        minWidth: '22%', 
        minHeight: 150, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cardText: { fontSize: 18, textAlign: 'center', color: '#fff' },
    columnWrapper: { justifyContent: 'space-between' }
});

export default CardViewer;
