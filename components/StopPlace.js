import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Switch, View, Button, ActivityIndicator } from 'react-native';
import createEnturService from '@entur/sdk';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Departure from './Departure.js';

const StopPlace = (props) => {
    const [isEnabled, toggleSwitch] = useState(false);
    const [departures, setDepartures] = useState([]);
    const service = createEnturService({ clientName: 'AtB-smartklokke' });

    function handleToggleDeparture(publicCode, frontText, isEnabled) {
        props.toggleDeparture(publicCode, frontText, props.name, props.nsrId, isEnabled);
    }

    function handleToggleEnable() {
        if (isEnabled) {
            setDepartures([]);
        }
        else {
            fetchDepartures();
        }
        toggleSwitch(!isEnabled);
    }

    async function fetchDepartures() {
        try {
            const params = {
                timeRange: 86400,
            }
            const result = await service.getDeparturesFromStopPlace(props.nsrId, params);
            var deps = [];

            result.forEach(dep => {
                if (!deps.some(depInArray => {
                    return depInArray.publicCode === dep.serviceJourney.journeyPattern.line.publicCode
                        && depInArray.frontText === dep.destinationDisplay.frontText
                })) {
                    deps.push({
                        publicCode: dep.serviceJourney.journeyPattern.line.publicCode,
                        frontText: dep.destinationDisplay.frontText,
                        serviceJourneyId: dep.serviceJourney.id,
                    });
                }
            });
            setDepartures(deps);

        } catch (error) {
            console.log(error)

        }
    }


    return (
        <SafeAreaView style={[styles.container, isEnabled ? styles.containerEnabled : styles.containerDisabled]}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handleToggleEnable}>
                <Text style={styles.title}>{props.name}</Text>
            </TouchableOpacity>

            {isEnabled && departures.length > 0 &&
                <View style={styles.bottom}>
                    <ScrollView horizontal={true}>
                        {departures.map(dep =>
                            <Departure key={dep.serviceJourneyId} publicCode={dep.publicCode} frontText={dep.frontText} stopPlaceId={props.nsrId} handleToggle={handleToggleDeparture} />
                        )}
                    </ScrollView>
                </View>
            }
            {isEnabled && departures.length == 0 &&
                <ActivityIndicator style={styles.loadingIcon} size="large" color="#FFFFFF" />
            }

        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        marginTop: 15,
        backgroundColor: '#353535',
        flexDirection: 'column',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,
        flex: 1,

    },
    containerDisabled: {
        height: 60,
    },
    containerEnabled: {
        height: 170,
    },
    bottom: {
        backgroundColor: '#2A2A2A',
        flex: 1,
    },
    touchableOpacity: {
        height: 60,
        marginLeft: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        color: 'white',
    },
    loadingIcon: {
        margin: 15,
    }
});

export default StopPlace;