import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { getCards } from './database';
import { LineChart } from 'react-native-chart-kit';

const StatisticsViewer = () => {

    const allCards = getCards();

    let totNbMana: string[] = [];
    let UniqueNbMana: string[] = [];
    const screenWidth = Dimensions.get('window').width;

    allCards.forEach((item, index) => {
        if (item.type != "land") {
            totNbMana.push(item.manaCost.toString());
            if (!UniqueNbMana.includes(item.manaCost.toString())) {
                UniqueNbMana.push(item.manaCost.toString());
            }
        }
    });
    UniqueNbMana.sort();
    const nbOcc = UniqueNbMana.map(mana => 
        totNbMana.filter(cost => cost === mana).length
    );
    console.log("all cost: ", totNbMana);
    console.log("UniqueNbMana: ", UniqueNbMana);
    console.log("nbOcc: ", nbOcc);
    

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={styles.title}>Mana Curve : </Text>
            {
                <LineChart
                    data={{
                        labels: UniqueNbMana,
                        datasets: [{ data: nbOcc }],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e26a0f',
                        backgroundGradientFrom: '#68af13',
                        backgroundGradientTo: '#9ac863',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    bezier // enables curve
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            }
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#395d0f',
    },
});

export default StatisticsViewer;
