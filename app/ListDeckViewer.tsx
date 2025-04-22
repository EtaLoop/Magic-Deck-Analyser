import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View, Pressable, Button } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';  // Utiliser useRouter pour la navigation
import { getDecks , setupDatabase} from './database';  // Assurez-vous que cette fonction retourne les decks.

interface Deck {
    id: string;
    name: string;
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
            const fetchedDecks = await getDecks(); // Assurez-vous que cette fonction retourne un tableau de decks
            setDecks(fetchedDecks);
        } catch (error) {
            console.error("Erreur lors du chargement des decks :", error);
        }
    };

    const handleAddDeck = () => {
        router.push('/AddDeck');  // Redirection vers la page de création de deck
    };

    const renderItem = ({ item }: { item: Deck }) => (
        <Link href={{ pathname: '/DeckViewer', params: { id: item.id } }} asChild>
            <Pressable style={styles.card}>
                <View>
                    <Text style={styles.cardText}>{item.name}</Text>
                </View>
            </Pressable>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title="Ajouter un deck" onPress={handleAddDeck} />
            </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 16
    },
    header: {
        marginBottom: 16,
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
