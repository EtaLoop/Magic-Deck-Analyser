import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, View, Button, ImageBackground, Dimensions } from 'react-native';
import { setupDatabase, getCards, getCardsByDeckId } from './database'; // Importe la DB locale
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface Card {
    id: number;  // Assurez-vous que `id` correspond bien à l'int SQL
    name: string;
    image: string;
}




const CardViewer = () => {
    const { id } = useLocalSearchParams(); // id sera une string

    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        setupDatabase(); // Initialisation unique de la DB
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const data = await getCardsByDeckId(Number(id));
            setCards(data);
        } catch (error) {
            console.error("Erreur lors du chargement des cartes du deck :", error);
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
        <SafeAreaView style={styles.container}>
            <Link href={{ pathname: '/deck_menu', params: { id: id } }} asChild>
                <TouchableOpacity style={styles.fab}>
                    <FontAwesome name="plus-circle" size={60} color="#007AFF" />
                </TouchableOpacity>
            </Link>
            <Link href="/Statistics" asChild>
                <TouchableOpacity style={styles.fabSecondary}>
                    <FontAwesome name="bar-chart" size={50} color="#2196F3" />
                </TouchableOpacity>
            </Link>
            <FlatList
                data={cards}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.cardContainer}
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
    fabSecondary: {
        marginBottom: 20, // spacing between buttons if 'gap' not supported
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
        overflow: 'scroll' // Empêche le débordement des bords arrondis
    },
    cardText: { fontSize: 18, textAlign: 'center', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 4, borderRadius: 4 },
    columnWrapper: { justifyContent: 'space-between' }
});

export default CardViewer;
