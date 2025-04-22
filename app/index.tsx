import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router'; // Pour naviguer entre les pages
import { TouchableOpacity } from "react-native";


const MenuScreen = () => {
    const router = useRouter();

    // Fonction pour naviguer vers les différentes pages
    const handleNavigation = (route: string) => {
        // Utilisation correcte de la navigation
        router.push(String(route));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Bienvenue sur Magic Deck Manager</Text>
            <Text style={styles.subheader}>Sélectionnez une option pour commencer</Text>

            <View style={styles.menuContainer}>

                {/* Option: Voir les Decks */}
                <Pressable style={styles.menuItem} onPress={() => handleNavigation('/ListDeckViewer')}>
                    <Text style={styles.menuText}>Voir les Decks</Text>
                </Pressable>

                {/* Option: Voir les Cartes */}
                <Pressable style={styles.menuItem} onPress={() => handleNavigation('/CardViewer')}>
                    <Text style={styles.menuText}>Voir les Cartes</Text>
                </Pressable>

                {/* Option: Gérer les Cartes */}
                <Pressable style={styles.menuItem} onPress={() => handleNavigation('/ManageCards')}>
                    <Text style={styles.menuText}>Gérer les Cartes</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    subheader: {
        fontSize: 18,
        color: '#555',
        marginBottom: 40,
    },
    menuContainer: {
        width: '100%',
        padding: 10,
    },
    menuItem: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
    },
});

export default MenuScreen;
