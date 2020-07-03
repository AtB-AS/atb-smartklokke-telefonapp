import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity, View } from 'react-native';
import createEnturService from '@entur/sdk';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import StopPlace from '../components/StopPlace.js';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EnabledStopPlace from '../components/EnabledStopPlace.js';

const NewJourney = () => {

    const [userInput, setUserInput] = useState('');
    //const [busListName, setBusListName] = useState('');
    const [stopPlaces, setStopPlaces] = useState([]);
    const [enabledStopPlaces, setEnabledStopPlaces] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
    const service = createEnturService({ clientName: 'AtB-smartklokke' });


    useEffect(() => {
        BackgroundGeolocation.getCurrentLocation(location => {
            setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
            })
        });
    }, []);

    useEffect(function getStop() {
        let mounted = true;
        async function callService() {
            try {
                const params = ['venue']
                const result = await service.getFeatures(userInput, currentLocation, params);
                if (mounted) {
                    const stops = result.filter(stopPlace => {
                        return stopPlace.properties.category[0] === 'onstreetBus';
                    });
                    setStopPlaces(stops);
                }
            } catch (error) {
                if (mounted) {
                    console.log(error);
                }
            }
        }
        callService();
        return () => { mounted = false }
    }, [userInput])

    function handleToggleDeparture(publicCode, frontText, stopPlace, stopPlaceId, isEnabled) {
        var newEnabledStopPlaces = [...enabledStopPlaces];
        if (isEnabled) {
            if (!newEnabledStopPlaces.some(stop => { return stop.id === stopPlaceId })) {
                newEnabledStopPlaces.push({
                    name: stopPlace,
                    id: stopPlaceId,
                    departures: [publicCode + '#' + frontText],
                });
            }
            else {

                newEnabledStopPlaces.forEach(stop => {
                    if (stop.id === stopPlaceId) {
                        stop.departures.push(publicCode + '#' + frontText);
                    }
                });
            }
        }
        else {
            newEnabledStopPlaces.forEach(stop => {
                if (stop.id === stopPlaceId) {
                    stop.departures = stop.departures.filter(dep => { return dep !== publicCode + '#' + frontText });
                }
            });
            newEnabledStopPlaces = newEnabledStopPlaces.filter(stop => { return stop.departures.length > 0 });
        }
        setEnabledStopPlaces(newEnabledStopPlaces);
    }


    async function handleSaveDeparturesPress() {
        if (enabledStopPlaces.length === 0) {
            return;
        }
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                console.log('data:', data);
                if (data) {

                    var journeyList = JSON.parse(data);
                    const journey = {
                        //name: busListName,
                        stopList: enabledStopPlaces,
                    }
                    journeyList.push(journey);
                    console.log('journeyList', journeyList);
                    storeData('journeyList', journeyList);
                }
            });
        } catch (e) {
            console.log(e);
        }
        setUserInput('');
        setStopPlaces([]);
        setEnabledStopPlaces([]);

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
            <View style={styles.top}>
                <View style={styles.stopInputContainer}>
                    <FontAwesome style={styles.icon} name={'search'} color={'black'} />
                    <TextInput
                        style={styles.stopInput}
                        onChangeText={setUserInput}
                        placeholder='Finn Busstopp'
                    />
                </View>
                <ScrollView horizontal={true} style={styles.enabledStopPlaces}>
                    {enabledStopPlaces.map(stop =>
                        <EnabledStopPlace key={stop.id} id={stop.id} name={stop.name} departures={stop.departures} handleToggle={handleToggleDeparture} />
                    )}
                </ScrollView>
            </View>
            <ScrollView>
                {stopPlaces.map(stop =>
                    <StopPlace key={stop.properties.id} name={stop.properties.label} nsrId={stop.properties.id} toggleDeparture={handleToggleDeparture} />
                )}
            </ScrollView>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handleSaveDeparturesPress}>
                <Text style={styles.buttonText}>Lagre Busser</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
    stopInput: {
        marginLeft: 5,
        padding: 5,
    },
    stopInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10,
        height: 40,
        paddingLeft: 10,
        backgroundColor: 'whitesmoke'
    },
    listNameInput: {
        borderRadius: 5,
        borderColor: 'grey',
        height: 40,
        paddingLeft: 10,
    },
    enabledStopPlaces: {
        flexDirection: 'row',
        height: 70,
    },
    button: {
        borderRadius: 1,
        borderColor: 'blue',
    },
    touchableOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a2ad00',
        margin: 10,
        height: 40,
    },
    buttonText: {
        color: 'white',
    },
    top: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
    },

});

export default NewJourney;