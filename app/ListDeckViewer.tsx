import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';  // Utiliser useRouter pour la navigation
import { getDecks, getCardsByDeckId, setupDatabase } from './database';  // Assurez-vous que cette fonction retourne les decks et les cartes.
import { FontAwesome } from "@expo/vector-icons";


interface Deck {
    id: string;
    name: string;
    image: string | null;  // L'image sera null si aucune carte n'est associée
}

const CardViewer = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const router = useRouter();

    useEffect(() => {
        setupDatabase();
        loadDecks();
    }, []);

    const loadDecks = async () => {
        try {
            const fetchedDecks = await getDecks(); // Récupérer tous les decks
            const decksWithImages = await Promise.all(
                fetchedDecks.map(async (deck: Deck) => {
                    const cards = await getCardsByDeckId(parseInt(deck.id));  // Récupérer les cartes pour chaque deck
                    const image = cards.length > 0 ? cards[0].image : null; // Utiliser l'image de la première carte du deck
                    return {
                        ...deck,
                        image: image,  // Ajouter l'image de la première carte
                    };
                })
            );
            setDecks(decksWithImages);
        } catch (error) {
            console.error("Erreur lors du chargement des decks :", error);
        }
    };

    // Rendu des éléments dans la FlatList
    const renderItem = ({ item }: { item: Deck }) => (
        <Link href={{ pathname: '/DeckViewer', params: { id: item.id } }} asChild>
            <TouchableOpacity style={styles.cardContainer}>
                {item.image ? (
                    <ImageBackground
                        source={{ uri: item.image }}  // Utilisation de l'image de la première carte
                        style={styles.card}
                        imageStyle={{ borderRadius: 8 }}
                    >
                        <Text style={styles.cardText}>{item.name}</Text>
                    </ImageBackground>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.cardText}>{item.name}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Link href="/AddDeck" asChild>
                <TouchableOpacity style={styles.fab}>
                    <FontAwesome name="plus-circle" size={60} color="#007AFF" />
                </TouchableOpacity>
            </Link>

            <FlatList
                data={decks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={3} // Affiche 3 decks par ligne
                columnWrapperStyle={styles.columnWrapper} // Optionnel: espace entre les colonnes
            />
        </SafeAreaView>
    );
};

const screenWidth = Dimensions.get('window').width;
const totalMargin = 6 * 8;
const cardWidth = (screenWidth - totalMargin) / 3;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0', padding: 0 },
    cardContainer: {
        width: cardWidth,
        height: 160,
        margin: 6
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    card: {
        flex: 1,
        padding: 6,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',  // Modifié de 'scroll' à 'hidden' pour éviter tout débordement
        backgroundColor: '#ccc', // Utiliser une couleur de fond par défaut si aucune image n'est présente
    },
    cardText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 4,
        borderRadius: 4,
    },
    columnWrapper: { justifyContent: 'space-between' },
});

export default CardViewer;
