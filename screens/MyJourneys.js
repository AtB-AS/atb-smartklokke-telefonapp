import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import createEnturService from '@entur/sdk';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Journey from '../components/Journey.js';
import StopPlace from '../components/StopPlace.js';
import AsyncStorage from '@react-native-community/async-storage';

const MyJourneys = () => {

    const [journeyList, setJourneyList] = useState([]);


    useEffect(() => {
        getData('journeyList');
    }, []);

    getData = async (key) => {
        try {
            await AsyncStorage.getItem(key).then(data => {
                if (data) {
                    setJourneyList(JSON.parse(data));
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    function handlePress() {
        getData('journeyList');
    }
    function deleteAll() {
        storeData('journeyList', []);
    }
    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {journeyList.map(journey =>
                    <Journey key={journey.name} name={journey.name} departures={journey.departures} />
                )}
            </ScrollView>

            <Button title='oppdater liste' onPress={handlePress} />
            <Button title='slett liste' onPress={deleteAll} />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        //backgroundColor: '#E3E6B3',
    },
    input: {
        borderRadius: 5,
        borderColor: 'grey',
        margin: 15,
        height: 40,
        paddingLeft: 10,
    },
    button: {
        borderRadius: 1,
        borderColor: 'blue',
    },
    touchableOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'cornflowerblue',
        margin: 10,
        height: 40,
    },
});

export default MyJourneys;