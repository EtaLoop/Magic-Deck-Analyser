import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Utiliser useRouter pour naviguer après l'ajout
import { addDeck } from './database';  // Ajoute cette fonction dans ta base de données pour gérer l'ajout

const AddDeck = () => {
    const [deckName, setDeckName] = useState('');
    const router = useRouter();

    const handleAddDeck = async () => {
        if (!deckName.trim()) {
            Alert.alert('Erreur', 'Le nom du deck est requis.');
            return;
        }

        try {
            // Ajouter le deck à la base de données
            await addDeck(deckName);
            Alert.alert('Succès', 'Deck ajouté avec succès.');
            
            // Rediriger vers la liste des decks après ajout
            router.push('/ListDeckViewer');  // Redirection vers la page de visualisation des decks
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d\'ajouter le deck.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nom du deck"
                value={deckName}
                onChangeText={setDeckName}
            />
            <Button title="Ajouter le deck" onPress={handleAddDeck} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default AddDeck;
