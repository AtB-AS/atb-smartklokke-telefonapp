import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const FavouriteDeparture = (props) => {


    const [timetoArrival, setTimeToArrival] = useState('');


    useEffect(() => {
        updateTimeToArrival();
    }, [props.expectedArrivalTime]);


    function updateTimeToArrival() {

        var arrivalDate = new Date(props.expectedArrivalTime.substring(0, 19));
        //arrivalDate.setHours(arrivalDate.getHours() - 2);
        var minToArrival = Math.floor((arrivalDate - new Date()) / 1000 / 60);
        if (minToArrival < 0) {
            minToArrival = 0;
        }
        setTimeToArrival(minToArrival);

    }


    return (
        <SafeAreaView style={styles.container}>
            <FontAwesome style={styles.icon} name={'bus'} color={'grey'} />
            <View style={styles.textContainer}>
                <Text style={styles.text}>{props.publicCode} {props.frontText}</Text>
                <Text style={styles.text}>Fra {props.quayName}</Text>
                <Text style={styles.text}>{timetoArrival} Min</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 11,
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        fontSize: 38,
        alignSelf: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: 'left',

    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 5,
    },

});

export default FavouriteDeparture;