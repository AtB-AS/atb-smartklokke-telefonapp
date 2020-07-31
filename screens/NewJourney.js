import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity, View, Button } from 'react-native';
import createEnturService from '@entur/sdk';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import StopPlace from '../components/StopPlace.js';
import EnabledStopPlace from '../components/EnabledStopPlace.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const NewJourneyTest = ({ navigation }) => {

    const [userInput, setUserInput] = useState('');
    const [stopPlaces, setStopPlaces] = useState([]);
    const [enabledStopPlaces, setEnabledStopPlaces] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
    const service = createEnturService({ clientName: 'AtB-smartklokke' });
    const [disableNextButton, setDisableNextButton] = useState(true);


    useEffect(() => {
        BackgroundGeolocation.getCurrentLocation(location => {
            setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
            })
        });
        navigation.setOptions({ title: 'Ny reise' });
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
        if (newEnabledStopPlaces.length > 0) {
            setDisableNextButton(false);
        }
        else {
            setDisableNextButton(true);
        }
    }

    function handleNextButtonPress() {
        navigation.navigate('NewJourneyDetails', { enabledStopPlaces: enabledStopPlaces });
    }

    function handleSearchBarCrossPress() {
        setUserInput('');
        setStopPlaces([]);
        textInput.clear();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.stopPlaceSearchContainer}>
                    <View style={styles.inputContainer}>
                        <FontAwesome style={styles.icon} name={'search'} color={'gray'} />
                        <TextInput
                            style={styles.stopInput}
                            onChangeText={setUserInput}
                            placeholder='Søk opp stoppesteder'
                            placeholderTextColor='gray'
                            ref={input => { textInput = input }}
                        />
                        <TouchableOpacity style={styles.searchBarCross} onPress={handleSearchBarCrossPress}>
                            <FontAwesome style={styles.icon} name={'times'} color={'gray'} />
                        </TouchableOpacity>
                    </View>
                </View>
                {enabledStopPlaces.length > 0 &&
                    <View style={styles.enabledDeparturesContainer}>
                        <Text style={styles.subTitle}>Lagrede linjer</Text>
                        <ScrollView horizontal={true} style={styles.enabledStopPlaces}>
                            {enabledStopPlaces.map(stop =>
                                <EnabledStopPlace key={stop.id} id={stop.id} name={stop.name} departures={stop.departures} handleToggle={handleToggleDeparture} />
                            )}
                        </ScrollView>
                    </View>
                }
                <View style={styles.stopPlacesContainer}>
                    {stopPlaces.length > 0 &&
                        <View>
                            {stopPlaces.map(stop =>
                                <StopPlace key={stop.properties.id} name={stop.properties.label} nsrId={stop.properties.id} toggleDeparture={handleToggleDeparture} />
                            )}
                        </View>
                    }
                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.nextButton, disableNextButton ? styles.nextButtonDisabled : styles.nextButtonEnabled]} onPress={handleNextButtonPress} disabled={disableNextButton} >
                <Text style={disableNextButton ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Neste</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1B1B',
        justifyContent: 'space-between',
    },
    stopPlaceSearchContainer: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
    },
    enabledDeparturesContainer: {
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
    },
    stopPlacesContainer: {
        marginLeft: 5,
        marginRight: 5,
    },
    subTitle: {
        fontSize: 15,
        color: 'white',
    },
    stopInput: {
        marginLeft: 5,
        padding: 5,
        width: '80%',
        color: 'white',
        backgroundColor: '#2A2A2A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        paddingLeft: 10,
        backgroundColor: '#2A2A2A',
    },
    enabledStopPlaces: {
        flexDirection: 'row',
        height: 60,
    },
    nextButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 10,
        height: 40,
    },
    nextButtonEnabled: {
        backgroundColor: '#828A00',
    },
    nextButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },
    buttonTextDisabled: {
        color: 'grey',
    },
    buttonTextEnabled: {
        color: 'white',
    },
    searchBarCross: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 16,
    }
});

export default NewJourneyTest;