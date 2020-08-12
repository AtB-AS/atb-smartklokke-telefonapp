import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, ScrollView, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Day from '../components/Day.js';
import NotificationTime from '../components/NotificationTime.js';
import NotificationTimePicker from '../components/NotificationTimePicker.js';


const NewJourneyDetails = ({ route, navigation }) => {

    const [journeyName, setJourneyName] = useState('');
    const [enabledDays, setEnabledDays] = useState([
        { name: 'Man', enabled: false },
        { name: 'Tir', enabled: false },
        { name: 'Ons', enabled: false },
        { name: 'Tor', enabled: false },
        { name: 'Fre', enabled: false },
        { name: 'Lør', enabled: false },
        { name: 'Søn', enabled: false }
    ]);
    const notificationTimes = [2, 5, 10, 15, 20, 30, 60];
    const [enabledNotificationTimes, setEnabledNotificationTimes] = useState([
        { time: 2, enabled: false },
        { time: 5, enabled: false },
        { time: 10, enabled: false },
        { time: 15, enabled: false },
        { time: 20, enabled: false },
        { time: 30, enabled: false },
        { time: 60, enabled: false }
    ]);
    const [notificationStartTime, setNotificationStartTime] = useState('00:00');
    const [notificationEndTime, setNotificationEndTime] = useState('00:00');
    const [disableSaveButton, setDisableSaveButton] = useState(false);

    function handleToggleDay(day, isEnabled) {
        var newEnabledDays = [...enabledDays];
        newEnabledDays.forEach(d => {
            if (d.name == day) {
                d.enabled = isEnabled;
            }
        });
        setEnabledDays(newEnabledDays);
    }

    function handleToggleNotificationTime(time, isEnabled) {
        var newEnabledNotificationTimes = [...enabledNotificationTimes];
        newEnabledNotificationTimes.forEach(t => {
            if (t.time == time) {
                t.enabled = isEnabled;
            }
        });
        setEnabledNotificationTimes(newEnabledNotificationTimes);
    }

    function handleStartNotificationtime(time) {
        setNotificationStartTime(time);
    }

    function handleEndNotificationTime(time) {
        setNotificationEndTime(time);
    }

    async function handleSaveDeparturesPress() {
        try {
            var journeyId = journeyName + new Date();
            var journeyList = []
            const journey = {
                id: journeyId,
                name: journeyName,
                stopList: route.params.enabledStopPlaces,
                notificationDays: enabledDays,
                notificationTimes: enabledNotificationTimes,
                notificationStartTime: notificationStartTime,
                notificationEndTime: notificationEndTime,
                notify: true,
            }
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    journeyList = JSON.parse(data);
                }
            });
            journeyList.push(journey);
            storeData('journeyList', journeyList);
        } catch (e) {
            console.log(e);
        }
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.editDetailsContainer}>
                    <View>
                        <Text style={styles.subTitle}>Gi reisen din et navn</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.stopInput}
                                onChangeText={setJourneyName}
                                placeholder='Reisenavn'
                                placeholderTextColor='gray'
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Intervall for varsling</Text>
                        <NotificationTimePicker
                            name="Starter"
                            handleSetTime={handleStartNotificationtime}
                        />
                        <NotificationTimePicker
                            name="Slutter"
                            handleSetTime={handleEndNotificationTime}
                        />
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Forekommer dager</Text>
                        <ScrollView horizontal={true}>
                            {enabledDays.map(day =>
                                <Day key={day.name} name={day.name} handleToggle={handleToggleDay} />
                            )}
                        </ScrollView>
                    </View>
                    <View>
                        <Text style={styles.subTitle}>Varsel før avganger</Text>
                        <ScrollView horizontal={true}>
                            {notificationTimes.map(minutes =>
                                <NotificationTime key={minutes} time={minutes} handleToggle={handleToggleNotificationTime} />
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
    stopInput: {
        marginLeft: 5,
        padding: 5,
        width: '90%',
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
});

export default NewJourneyDetails;