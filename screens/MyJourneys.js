import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, ImageBackground, View, Alert } from 'react-native';
import Journey from '../components/Journey.js';
import AsyncStorage from '@react-native-community/async-storage';
import { sendMessage, subscribeToReachability, } from 'react-native-watch-connectivity';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const MyJourneys = ({ navigation }) => {

    const [journeyList, setJourneyList] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [messageFromWatch, setMessageFromWatch] = useState('Svar fra watch: ');
    const [watchReachable, setWatchReachable] = useState(false);

    const unsubscribe = subscribeToReachability(reachable => {
        setWatchReachable(reachable);
    })

    useFocusEffect(
        React.useCallback(() => {
            updateList();
            return () => unsubscribe();
        }, [])
    );

    async function updateList() {
        try {
            await AsyncStorage.getItem('journeyList').then(async data => {
                setJourneyList(JSON.parse(data));
            });
        } catch (e) {
            console.log(e);
        };
    }
    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    function sendMsgToWatch() {
        const message = {
            'message': userInput,
        }
        const replyHandler = response => {
            console.log("Response from watch received", response);
            setMessageFromWatch('Svar fra watch: ' + response.text);
        }
        const errorHandler = error => {
            console.error(error)
        }
        sendMessage(message, replyHandler, errorHandler);
    }

    function handleDeleteButtonPress(journeyName) {
        Alert.alert(
            'Slett Reise',
            'Vil du slette ' + journeyName + '?',
            [
                { text: 'Nei', },
                { text: 'Ja', onPress: () => deleteJourney(journeyName) },
            ],
            { cancelable: false },
        );
    }

    async function deleteJourney(journeyName) {
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    var journeyList = JSON.parse(data);
                    journeyList.splice(journeyList.findIndex(e => e.name == journeyName), 1);
                    storeData('journeyList', journeyList);
                }
            });
        } catch (e) {
            console.log(e);
        }
        updateList();
    }

    async function editJourney(journeyName) {
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    var journeyList = JSON.parse(data);
                    journeyList.forEach(journey => {
                        if (journey.name == journeyName) {
                            navigation.navigate('EditJourney', { journey: journey });
                        }
                    });

                }
            });
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {journeyList.map(journey =>
                    <Journey key={journey.id}
                        name={journey.name}
                        stopList={journey.stopList}
                        notificationDays={journey.notificationDays}
                        notificationTimes={journey.notificationTimes}
                        notificationStartTime={journey.notificationStartTime}
                        notificationEndTime={journey.notificationEndTime}
                        handleDelete={handleDeleteButtonPress}
                        handleEdit={editJourney}
                    />
                )}
            </ScrollView>
            <TouchableOpacity style={styles.NewJourneyButton} onPress={() => navigation.navigate('NewJourney')}>
                <FontAwesome style={styles.icon} name={'plus'} color={'#FFFFFF'} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
    NewJourneyButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 15,
        right: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#1B1B1B",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,
    },
    icon: {
        fontSize: 26,
        marginLeft: 2,
        marginTop: 2,
        color: '#1B1B1B'
    },
});

export default MyJourneys;