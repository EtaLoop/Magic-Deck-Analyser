import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View } from 'react-native';
import axios from 'axios';

// Définir un type pour les éléments de votre card
interface Card {
    id: string;
    name: string;
}

const CardViewer = () => {
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3000/cards')
            .then(response => setCards(response.data))
            .catch(error => console.error('Erreur lors de la récupération des cartes:', error));
    }, []);

    // Spécifier que le paramètre de renderItem a le type 'Card'
    const renderItem = ({ item }: { item: Card }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cards}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={4} // Affiche 4 cards par ligne
                columnWrapperStyle={styles.columnWrapper} // Optionnel: espace entre les colonnes
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16
    },
    card: {
        backgroundColor: 'red',
        padding: 16,
        margin: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flex: 1, // Assure que les éléments prennent un espace égal
        marginHorizontal: 4, // Espacement horizontal entre les cards
        paddingLeft: 0,
        maxWidth: '22%',
        minHeight: 150,
    },
    cardText: {
        fontSize: 18,
        textAlign: 'center' // Centrer le texte dans la card
    },
    columnWrapper: {
        justifyContent: 'space-between', // Ajouter de l'espace entre les colonnes
    }
});

export default CardViewer;
