import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text, FlatList, ImageBackground, Dimensions } from 'react-native';
import { addCard, addLinkDeckCard, getCardByName, getCardsByDeckId } from './database';
import { useLocalSearchParams } from 'expo-router';

interface Card {
    id: number;
    name: string;
    image: string;
}

function getManaCostTotal(manaString: string) {
  const regex = /{(.*?)}/g;
  let match;
  let total = 0;

  while ((match = regex.exec(manaString)) !== null) {
    const value = match[1];
    const number = parseInt(value);
    total += isNaN(number) ? 1 : number;
  }

  return total;
}

const FormScreen = () => {
    const { id: deckId } = useLocalSearchParams();
    const [cardName, setCardName] = useState('');
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
    const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = () => {
        const localCards = getCardsByDeckId(Number(deckId));
        setAllCards(localCards);
        setFilteredCards(localCards);
    };

    const handleSearchChange = (text: string) => {
        setCardName(text);
        const filtered = allCards.filter(card => card.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCards(filtered);
    };

    const handleSubmit = async () => {
        if (!cardName.trim()) {
            alert('Please enter a card name');
            return;
        }

        setLoading(true);
        setError(null);
        setCardImageUrl(null);

        try {
            const existingCard = getCardByName(cardName.trim());

            if (existingCard) {
                alert('Card already exists locally. Linking to deck.');
                setCardImageUrl(existingCard.image);
                addLinkDeckCard(Number(deckId), existingCard.id);
                loadCards();
                return;
            }

            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();

            if (data.code === "not_found") {
                alert("Card not found, try again.");
                return;
            }

            console.log(data);
            let manaCost = getManaCostTotal(data.mana_cost);
            console.log("mana cost: ", manaCost);

            let type = data.type_line.split("—")[0].trim();

            if (type.includes("Artefact")) {
                type = "Artefact";
            } else if (type.includes("Creature")) {
                type = "Creature";
            } else if (type.includes("Sorcery")) {
                type = "Sorcery";
            } else if (type.includes("Land")) {
                type = "Land";
            } else {
                type = "Unknown";
            }

            const newCardId = addCard(data.name, data.image_uris.normal, type, manaCost);
            addLinkDeckCard(Number(deckId), Number(newCardId));
            setCardImageUrl(data.image_uris.normal);
            alert("Card added and linked!");
            loadCards();
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Card }) => (
        <View style={styles.cardContainer}>
            <ImageBackground source={{ uri: item.image }} style={styles.card} imageStyle={{ borderRadius: 8 }}>
                <Text style={styles.cardText}>{item.name}</Text>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search or add card"
                value={cardName}
                onChangeText={handleSearchChange}
            />
            <Button title="Search online & link" onPress={handleSubmit} />
            {loading && <Text>Loading...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            {cardImageUrl && (
                <Image
                    style={styles.cardImage}
                    source={{ uri: cardImageUrl }}
                />
            )}
            <FlatList
                data={filteredCards}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.cardListContainer}
            />
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const totalMargin = 6 * 8;
const cardWidth = (screenWidth - totalMargin) / 3;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4
    },
    cardListContainer: {
        paddingVertical: 8,
        alignItems: 'center'
    },
    cardContainer: {
        width: cardWidth,
        height: 160,
        margin: 6
    },
    card: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 4
    },
    cardText: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 4,
        borderRadius: 4,
        textAlign: 'center'
    },
    cardImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginTop: 16,
    },
    error: {
        color: 'red',
        marginTop: 8,
    },
});

export default FormScreen;
