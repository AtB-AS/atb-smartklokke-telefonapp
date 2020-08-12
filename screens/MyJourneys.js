import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, ImageBackground, View, Alert } from 'react-native';
import Journey from '../components/Journey.js';
import AsyncStorage from '@react-native-community/async-storage';
import { sendMessage, subscribeToReachability, updateApplicationContext, transferCurrentComplicationUserInfo, transferUserInfo, watchEvents } from 'react-native-watch-connectivity';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundFetch from "react-native-background-fetch";
import createEnturService from '@entur/sdk';


const MyJourneys = ({ navigation }) => {

    const [journeyList, setJourneyList] = useState([]);
    const [messageFromWatch, setMessageFromWatch] = useState('Svar fra watch: ');
    const [watchReachable, setWatchReachable] = useState(false);
    const service = createEnturService({ clientName: 'AtB-smartklokke' });


    const unsubscribe = subscribeToReachability(reachable => {
        setWatchReachable(reachable);
    })





    useFocusEffect(
        React.useCallback(() => {
            PushNotificationIOS.requestPermissions();
            PushNotificationIOS.cancelAllLocalNotifications();
            updateList();
            updateDeparturesAndScheduleNotifications();

            BackgroundFetch.configure({
                minimumFetchInterval: 15,

            }, async (taskId) => {
                console.log("[js] Received background-fetch event: ", taskId);

                updateDeparturesAndScheduleNotifications();

                BackgroundFetch.finish(taskId);
            }, (error) => {
                console.log("[js] RNBackgroundFetch failed to start");
            });

            BackgroundFetch.status((status) => {
                switch (status) {
                    case BackgroundFetch.STATUS_RESTRICTED:
                        console.log("BackgroundFetch restricted");
                        break;
                    case BackgroundFetch.STATUS_DENIED:
                        console.log("BackgroundFetch denied");
                        break;
                    case BackgroundFetch.STATUS_AVAILABLE:
                        console.log("BackgroundFetch is enabled");
                        break;
                }
            });

            return () => unsubscribe();
        }, [])
    );

    useEffect(() => {


    }, []);





    async function updateDeparturesAndScheduleNotifications() {
        var stopPlaceIds = [];
        var JourneyDepartures = [];
        var realTimeDeps = [];
        var journeyNotifications = [];
        var initialWatchMessage = true;
        try {
            await AsyncStorage.getItem('journeyList').then(async data => {
                data = JSON.parse(data);
                var dateToday = new Date();
                var today = dateToday.getDay() - 1;
                if (today < 0) {
                    today = 6;
                }
                if (data) {
                    data.forEach(journey => {
                        var notificationStartDate = new Date();
                        notificationStartDate.setHours(parseInt(journey.notificationStartTime.substring(0, 2)));
                        notificationStartDate.setMinutes(parseInt(journey.notificationStartTime.substring(3, 5)));

                        var notificationEndDate = new Date();
                        notificationEndDate.setHours(parseInt(journey.notificationEndTime.substring(0, 2)));
                        notificationEndDate.setMinutes(parseInt(journey.notificationEndTime.substring(3, 5)));

                        if (journey.notificationDays[today].enabled && journey.notify) {
                            journeyNotifications.push({
                                journeyName: journey.name,
                                notificationStartDate: notificationStartDate,
                                notificationEndDate: notificationEndDate,
                                notificationTimes: journey.notificationTimes,
                            });
                            journey.stopList.forEach(stop => {
                                stopPlaceIds.push(stop.id);
                                stop.departures.forEach(dep => {
                                    JourneyDepartures.push({
                                        publicCode: dep.split('#')[0],
                                        frontText: dep.split('#')[1],
                                    });
                                })
                            })
                        }
                    });
                }

            });
            const params = {
                timeRange: 3600,
            }
            const result = await service.getDeparturesFromStopPlaces(stopPlaceIds, params);

            result.forEach(stop => {
                stop.departures.forEach(dep => {
                    if (JourneyDepartures.some(journeyDep => { return journeyDep.publicCode + journeyDep.frontText == dep.serviceJourney.journeyPattern.line.publicCode + dep.destinationDisplay.frontText })) {
                        realTimeDeps.push({
                            publicCode: dep.serviceJourney.journeyPattern.line.publicCode,
                            frontText: dep.destinationDisplay.frontText,
                            expectedArrivalTime: dep.expectedArrivalTime,
                            quayName: dep.quay.name,
                            stopPlaceName: dep.quay.stopPlace.name,
                            stopPlaceId: dep.quay.stopPlace.id,
                        });
                    }
                })
            });

            realTimeDeps.forEach(dep => {

                var arrivalDate = new Date(dep.expectedArrivalTime.substring(0, 19));
                arrivalDate.setHours(arrivalDate.getHours() - 2);
                var timetoArrival = Math.floor((arrivalDate - new Date()) / 1000 / 60);
                var arrivalTime = ("0" + arrivalDate.getHours()).slice(-2) + ':' + ("0" + arrivalDate.getMinutes()).slice(-2)
                var arrivalDateFormatter = arrivalDate.getFullYear() + '/' + ("0" + (arrivalDate.getMonth() + 1)).slice(-2) + '/' + ("0" + arrivalDate.getDate()).slice(-2) + ' ' + ("0" + arrivalDate.getHours()).slice(-2) + ':' + ("0" + arrivalDate.getMinutes()).slice(-2)
                journeyNotifications.forEach(journeyNotification => {
                    if (arrivalDate < journeyNotification.notificationEndDate && arrivalDate > journeyNotification.notificationStartDate) {
                        journeyNotification.notificationTimes.forEach(time => {
                            if (time.enabled && timetoArrival >= time.time) {
                                var notificationDate = new Date();
                                var minBeforeDeparture = time.time;
                                notificationDate.setMinutes(notificationDate.getMinutes() + timetoArrival - minBeforeDeparture);
                                var details = {
                                    fireDate: notificationDate.toISOString(),
                                    alertTitle: dep.publicCode + ' ' + dep.frontText,
                                    alertBody: 'Går om ' + minBeforeDeparture + ' min',
                                }
                                PushNotificationIOS.scheduleLocalNotification(details);
                            }
                        })
                    }
                })
                transferUserInfo({
                    'publicCode': dep.publicCode,
                    'frontText': dep.frontText,
                    'arrivalTime': arrivalTime,
                    'quayName': dep.quayName,
                    'dateFormatter': arrivalDateFormatter,
                    'id': dep.publicCode + dep.frontText + arrivalTime,
                    'initialMessage': initialWatchMessage,
                });
                initialWatchMessage = false;

            })

        } catch (e) {
            console.log(e);
        };
    }






    async function updateList() {
        try {
            await AsyncStorage.getItem('journeyList').then(async data => {
                if (data) {
                    setJourneyList(JSON.parse(data));
                }

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
            'message': 'hei watch',
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

    async function toggleNotificationsForJourney(name, isEnabled) {
        try {
            await AsyncStorage.getItem('journeyList').then(data => {
                if (data) {
                    var journeyList = JSON.parse(data);
                    journeyList.forEach(j => {
                        if (j.name == name) {
                            j.notify = isEnabled;
                        }
                    });
                    storeData('journeyList', journeyList);
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
                        isEnabled={journey.notify}
                        handleDelete={handleDeleteButtonPress}
                        handleEdit={editJourney}
                        handleToggleSwitch={toggleNotificationsForJourney}
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