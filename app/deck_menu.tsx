import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text } from 'react-native';
import { addCard } from './database';

const FormScreen = () => {
    
    const [cardName, setCardName] = useState('');
    const [data, setCardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!cardName.trim()) {
            alert('Please enter a card name');
            return;
        }
        setLoading(true);
        setError(null);
        setCardData(null);
        setCardImageUrl(null);
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();
            console.log(data);
            if (data.code == "not_found") {
                alert("Card not found, try again.");
            } else {
                alert("Card found.");
                setCardData(data);
                showCard(data); // Appel de la fonction showCard avec les données de la carte
                addCard(data.name, data.image_uris.normal);
            }
        } catch (error) {
            console.log("error");
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const showCard = (cardData: any) => {
        if (cardData && cardData.image_uris && cardData.image_uris.normal) {
            setCardImageUrl(cardData.image_uris.normal);
        } else {
            alert("No image available for this card.");
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Card name"
                value={cardName}
                onChangeText={setCardName}
            />
            <Button title="Search" onPress={handleSubmit} />
            
            {loading && <Text>Loading...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            
            {cardImageUrl && (
                <Image
                    style={styles.cardImage}
                    source={{ uri: cardImageUrl }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    cardImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginTop: 16,
    },
    error: {
        color: 'red',
        marginTop: 16,
    },
});

export default FormScreen;