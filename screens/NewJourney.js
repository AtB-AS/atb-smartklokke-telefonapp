import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, View } from 'react-native';
import createEnturService from '@entur/sdk';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Journey from '../components/Journey.js';
import StopPlace from '../components/StopPlace.js';
import EnabledDeparture from '../components/EnabledDeparture.js';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NewJourney = () => {

    const [userInput, setUserInput] = useState('');
    const [busListName, setBusListName] = useState('');
    const [stopPlaces, setStopPlaces] = useState([]);
    const [enabledDepartures, setEnabledDepartures] = useState([]);
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
        var newArray = [...enabledDepartures];
        if (isEnabled) {
            newArray.push({
                publicCode: publicCode,
                frontText: frontText,
                stopPlaceId: stopPlaceId,
                id: publicCode + '#' + frontText + '#' + stopPlace,
            });
        }
        else {
            newArray = newArray.filter(enabledDep => {
                return enabledDep.id !== publicCode + '#' + frontText + '#' + stopPlace;
            });
        }
        setEnabledDepartures(newArray);
    }


    async function handleSaveDeparturesPress() {
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    var journeyList = JSON.parse(data);
                    const journey = {
                        name: busListName,
                        departures: enabledDepartures,
                    }
                    journeyList.push(journey);
                    console.log(journeyList);
                    storeData('journeyList', journeyList);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
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


                <TextInput
                    style={styles.listNameInput}
                    onChangeText={setBusListName}
                    placeholder='Min bussliste'
                />
                <ScrollView horizontal={true} style={styles.enabledDepartureList}>
                    {enabledDepartures.map(departure =>
                        <EnabledDeparture key={departure.id} publicCode={departure.publicCode} frontText={departure.frontText} />
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
        //backgroundColor: '#E3E6B3',
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
        //borderWidth: 1,
        borderRadius: 5,
        borderColor: 'grey',
        height: 40,
        paddingLeft: 10,
    },
    enabledDepartureList: {
        flexDirection: 'row',
        height: 70,
        marginBottom: 10,
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
        //margin: 5,
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
    },

});

export default NewJourney;