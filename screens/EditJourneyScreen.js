import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity, View, Button } from 'react-native';
import createEnturService from '@entur/sdk';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import StopPlace from '../components/StopPlace.js';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EnabledStopPlace from '../components/EnabledStopPlace.js';
import Day from '../components/Day.js';
import NotificationTime from '../components/NotificationTime.js';
import NotificationTimePicker from '../components/NotificationTimePicker.js';


const EditJourneyScreen = ({ route, navigation }) => {

    const [stopPlaceInput, setStopPlaceInput] = useState('');
    const [journeyName, setJourneyName] = useState('');
    const [enabledStopPlaces, setEnabledStopPlaces] = useState([]);
    const [stopPlaces, setStopPlaces] = useState([]);
    const [days, setDays] = useState([]);
    const [notificationTimes, setNotificationTimes] = useState([]);
    const [notificationStartTime, setNotificationStartTime] = useState('');
    const [notificationEndTime, setNotificationEndTime] = useState('');
    const [disableSaveButton, setDisableSaveButton] = useState(false);
    const [showAddStopPlaces, setShowAddStopPlaces] = useState(false);
    const service = createEnturService({ clientName: 'AtB-smartklokke' });
    const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        setNotificationStartTime(route.params.journey.notificationStartTime);
        setNotificationEndTime(route.params.journey.notificationEndTime);
        setJourneyName(route.params.journey.name);
        setEnabledStopPlaces(route.params.journey.stopList);
        var initialDays = [
            { name: 'Man', enabled: false },
            { name: 'Tir', enabled: false },
            { name: 'Ons', enabled: false },
            { name: 'Tor', enabled: false },
            { name: 'Fre', enabled: false },
            { name: 'Lør', enabled: false },
            { name: 'Søn', enabled: false }
        ];
        for (let i = 0; i < route.params.journey.notificationDays.length; i++) {
            if (route.params.journey.notificationDays[i].enabled) {
                initialDays[i].enabled = true;
            }
        }
        var initialNotificationTimes = [
            { time: 2, enabled: false },
            { time: 5, enabled: false },
            { time: 10, enabled: false },
            { time: 15, enabled: false },
            { time: 20, enabled: false },
            { time: 30, enabled: false },
            { time: 60, enabled: false }];
        for (let i = 0; i < route.params.journey.notificationTimes.length; i++) {
            if (route.params.journey.notificationTimes[i].enabled) {
                initialNotificationTimes[i].enabled = true;
            }
        }
        setDays(initialDays);
        setNotificationTimes(initialNotificationTimes);
    }, []);

    useEffect(function getStop() {
        let mounted = true;
        async function callService() {
            try {
                const params = ['venue']
                const result = await service.getFeatures(stopPlaceInput, currentLocation, params);
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
    }, [stopPlaceInput])

    useEffect(() => {
        BackgroundGeolocation.getCurrentLocation(location => {
            setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
            })
        });
        navigation.setOptions({ title: route.params.journey.name });
    }, []);

    function handleToggleDay(day, isEnabled) {
        var newEnabledDays = [...days];
        newEnabledDays.forEach(d => {
            if (d.name == day) {
                d.enabled = isEnabled;
            }
        });
        setDays(newEnabledDays);
    }

    function handleToggleNotificationTime(time, isEnabled) {
        var newEnabledNotificationTimes = [...notificationTimes];
        newEnabledNotificationTimes.forEach(t => {
            if (t.time == time) {
                t.enabled = isEnabled;
            }
        });
        setNotificationTimes(newEnabledNotificationTimes);
    }

    function handleStartNotificationtime(time) {
        setNotificationStartTime(time);
    }

    function handleEndNotificationTime(time) {
        setNotificationEndTime(time);
    }

    async function handleSaveDeparturesPress() {
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    var journeyList = JSON.parse(data);
                    var journeyId = journeyName + new Date();
                    journeyList.forEach(j => {
                        if (j.name == route.params.journey.name) {
                            j.id = journeyId;
                            j.name = journeyName;
                            j.stopList = enabledStopPlaces;
                            j.notificationDays = days;
                            j.notificationTimes = notificationTimes;
                            j.notificationStartTime = notificationStartTime;
                            j.notificationEndTime = notificationEndTime;
                        }
                    });
                    storeData('journeyList', journeyList);
                }
            });
        } catch (e) {
            console.log(e);
        }
        setEnabledStopPlaces([]);
        setDays([]);
        setNotificationTimes([]);
        setNotificationStartTime('');
        setNotificationEndTime('');
        navigation.navigate('MyJourneys');
    }

    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

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
        if (newEnabledStopPlaces.length > 0) {
            setDisableSaveButton(false);
        }
        else {
            setDisableSaveButton(true);
        }
        setEnabledStopPlaces(newEnabledStopPlaces);
    }

    function handleSearchBarCrossPress() {
        setStopPlaceInput('');
        setStopPlaces([]);
        textInput.clear();
    }



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.editDetailsContainer}>
                    <View>
                        <Text style={styles.subTitle}>Reisenavn</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.stopInput}
                                onChangeText={setJourneyName}
                                onEndEditing={() => navigation.setOptions({ title: journeyName })}
                                value={journeyName}
                                placeholder='Reisenavn'
                                placeholderTextColor='gray'
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Lagrede linjer</Text>
                        <ScrollView horizontal={true} style={styles.enabledStopPlaces}>
                            {enabledStopPlaces.map(stop =>
                                <EnabledStopPlace key={stop.id} id={stop.id} name={stop.name} departures={stop.departures} handleToggle={handleToggleDeparture} />
                            )}
                            <TouchableOpacity style={styles.addBusButton} onPress={() => setShowAddStopPlaces(!showAddStopPlaces)}>
                                <FontAwesome style={styles.icon} name={'plus'} color={'#FFFFFF'} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {showAddStopPlaces &&
                        <ScrollView>
                            <View style={styles.stopPlaceSearchContainer}>
                                <View style={styles.inputContainer}>
                                    <FontAwesome style={styles.icon} name={'search'} color={'gray'} />
                                    <TextInput
                                        style={styles.stopInput}
                                        onChangeText={setStopPlaceInput}
                                        autoFocus={true}
                                        placeholder='Søk opp stoppesteder'
                                        placeholderTextColor='gray'
                                        ref={input => { textInput = input }}
                                    />
                                    <TouchableOpacity style={styles.searchBarCross} onPress={handleSearchBarCrossPress}>
                                        <FontAwesome style={styles.icon} name={'times'} color={'gray'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
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
                    }
                    <View>
                        <Text style={styles.subTitle}>Intervall for varsling</Text>
                        <NotificationTimePicker
                            name="Starter"
                            initialTime={notificationStartTime}
                            handleSetTime={handleStartNotificationtime}
                        />
                        <NotificationTimePicker
                            name="Slutter"
                            initialTime={notificationEndTime}
                            handleSetTime={handleEndNotificationTime}
                        />
                    </View>
                    <View style={styles.daysContainer}>
                        <Text style={styles.subTitle}>Forekommer dager</Text>
                        <ScrollView horizontal={true}>
                            {days.map(day =>
                                <Day key={day.name} name={day.name} handleToggle={handleToggleDay} initialEnabled={day.enabled} />
                            )}
                        </ScrollView>
                    </View>
                    <View style={styles.daysContainer}>
                        <Text style={styles.subTitle}>Varsel før avganger</Text>
                        <ScrollView horizontal={true}>
                            {notificationTimes.map(time =>
                                <NotificationTime key={time.time} time={time.time} initialEnabled={time.enabled} handleToggle={handleToggleNotificationTime} />
                            )}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.saveButton, disableSaveButton ? styles.saveButtonDisabled : styles.saveButtonEnabled]} onPress={handleSaveDeparturesPress} disabled={disableSaveButton} >
                <Text style={disableSaveButton ? styles.buttonTextDisabled : styles.buttonTextEnabled}>Lagre</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1B1B',
    },
    editDetailsContainer: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 30,
        justifyContent: 'space-between',
        flex: 1,
    },
    subTitle: {
        fontSize: 15,
        color: 'white',
    },
    stopPlaceSearchContainer: {
        justifyContent: 'center',
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
        marginTop: 5,
        marginBottom: 10,
        height: 40,
        paddingLeft: 10,
        backgroundColor: '#2A2A2A',
    },
    enabledStopPlaces: {
        flexDirection: 'row',
        height: 60,
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 20,
        height: 40,
    },
    saveButtonEnabled: {
        backgroundColor: '#828A00',
    },
    saveButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },
    buttonTextDisabled: {
        color: 'grey',
    },
    buttonTextEnabled: {
        color: 'white',
    },
    addBusButton: {
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 15,
        margin: 5,
        height: 35,
        width: 57,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 16,
    },
    searchBarCross: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditJourneyScreen;