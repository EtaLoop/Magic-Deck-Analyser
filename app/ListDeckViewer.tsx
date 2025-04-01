import React from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View ,Pressable} from 'react-native';
import { Link } from 'expo-router';

// Définir un type pour les éléments de votre card
interface Card {
    id: string;
    name: string;
}

const cardViewer = () => {
    const card: Card[] = [
        { id: '1', name: 'deck A' },
        { id: '2', name: 'deck B' },
        { id: '3', name: 'deck C' },
        { id: '4', name: 'deck D' },
        { id: '5', name: 'deck E' },

    ];

    // Spécifier que le paramètre de renderItem a le type 'Card'
    const renderItem = ({ item }: { item: Card }) => (
        <Link href="/DeckViewer" asChild>
            <Pressable  style={styles.card}>
                <View>
                    <Text style={styles.cardText}>{item.name}</Text>
                </View>
            </Pressable>

        </Link>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={card}
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

export default cardViewer;
