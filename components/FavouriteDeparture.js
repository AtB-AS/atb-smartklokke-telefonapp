import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const FavouriteDeparture = (props) => {

    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [timetoArrival, setTimeToArrival] = useState('');
    const [isDistrictBus, setIsDistrictBus] = useState(false);


    useEffect(() => {
        updateTimeToArrival();
    }, [props.expectedArrivalTime]);

    useEffect(() => {
        if (props.publicCode.length > 2) {
            setIsDistrictBus(true);
        }
    }, []);


    function updateTimeToArrival() {
        var arrivalDate = new Date(props.expectedArrivalTime.substring(0, 19));
        arrivalDate.setHours(arrivalDate.getHours() - 2);
        var arrivalTime = Math.floor((arrivalDate - new Date()) / 1000 / 60);
        if (arrivalTime <= 0) {
            arrivalTime = 'Nå';
        }
        else if (arrivalTime > 30) {
            arrivalTime = arrivalDate.getHours() + ':' + arrivalDate.getMinutes();
        }
        else {
            arrivalTime += ' Min';
        }
        setTimeToArrival(arrivalTime);
    }

    function handlePress() {
        setShowMoreInfo(!showMoreInfo);
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.iconContainer, isDistrictBus ? styles.districtbus : styles.cityBus, showMoreInfo ? styles.iconContainerShowMoreInfo : styles.iconContainerShowLessInfo]}>
                <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
                    <FontAwesome style={styles.icon} name={'bus'} color={'#FFFFFF'} />
                    <Text style={styles.text}>{props.publicCode}</Text>
                    <Text style={styles.text}>{showMoreInfo ? props.frontText : ''}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.text}>{timetoArrival}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 50,
    },
    icon: {
        fontSize: 20,
        marginLeft: 5,
        marginRight: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 15,
        //margin: 5,
        height: 35,
        alignItems: 'center',
    },
    iconContainerShowMoreInfo: {

    },
    iconContainerShowLessInfo: {
        width: 57,
    },
    districtbus: {
        backgroundColor: '#007C92',
    },
    cityBus: {
        backgroundColor: '#828A00',
    },
    touchableOpacity: {
        flex: 1,
        flexDirection: 'row',
        height: 35,
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        textAlign: 'left',
        color: '#FFFFFF',
        marginRight: 5,
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 5,
    },

});

export default FavouriteDeparture;