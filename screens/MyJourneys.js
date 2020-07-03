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
        getData();
    }, []);


    async function getData() {
        try {
            await AsyncStorage.getItem('journeyList').then(async data => {
                console.log(data);
                setJourneyList(JSON.parse(data));
            });
        } catch (e) {
            console.log(e);
        }

    }

    function updateList() {
        getData('journeyList');
    }
    function deleteAll() {
        storeData('journeyList', []);
        updateList();
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
                    <Journey key={journey.stopList[0].id} stopList={journey.stopList} />
                )}
            </ScrollView>
            <Button title='oppdater liste' onPress={getData} />
            <Button title='slett liste' onPress={deleteAll} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
});

export default MyJourneys;