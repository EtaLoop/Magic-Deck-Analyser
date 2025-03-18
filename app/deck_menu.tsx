import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const FormScreen = () => {
    
    const [cardName, setCardName] = useState('');
    const [data, setCardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!cardName.trim()) {
            alert('Please enter a card name');
            return;
        }
        setLoading(true);
        setError(null);
        setCardData(null);
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const data = await response.json();
            console.log(data);
            if (data.code == "not_found") {
                alert("Card not found, try again.");
            } else {
                alert("Card found.");
                setCardData(data);
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Card name"
        value={cardName}
        onChangeText={setCardName}
      />
      <Button title="Search" onPress={handleSubmit} />
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
});

export default FormScreen;