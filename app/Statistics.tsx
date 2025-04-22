import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getCards } from './database';

const StatisticsViewer = () => {

    const allCards = getCards();
    let manaCost = 0;
    let totalCard = 0;

    allCards.forEach((item, index) => {
        console.log("item: ", item);
    });

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Mana Curve : </Text>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#4CAF50',
    },
  });

export default StatisticsViewer;
