import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, Switch, View, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import createEnturService from '@entur/sdk';
import { ScrollView } from 'react-native-gesture-handler';
import Departure from './Departure.js';

const StopPlace = (props) => {
    //const [isEnabled, toggleSwitch] = useState(false);
    const [departures, setDepartures] = useState([]);
    const service = createEnturService({ clientName: 'AtB-smartklokke' });

    //var departureDate = new Date(departure.expectedDepartureTime.substring(0, 19));
    //departureDate.setHours(departureDate.getHours() - 2);
    //var minToDeparture = Math.floor((departureDate - new Date()) / 1000 / 60);


    useEffect(() => {
        let mounted = true;
        async function callService() {
            try {
                const params = {
                    timeRange: 86400,
                }
                const result = await service.getDeparturesFromStopPlace(props.nsrId, params);
                if (mounted) {
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
                }
            } catch (error) {
                if (mounted) {
                    console.log(error)
                }
            }
        }
        callService();
        return () => { mounted = false }
    }, []);





    function handleToggleDeparture(publicCode, frontText, isEnabled) {
        props.toggleDeparture(publicCode, frontText, props.name, props.nsrId, isEnabled);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>{props.name}</Text>
            </View>
            <View style={styles.bottom}>
                <ScrollView horizontal={true}>
                    {departures.map(dep =>
                        <Departure key={dep.serviceJourneyId} publicCode={dep.publicCode} frontText={dep.frontText} stopPlaceId={props.nsrId} handleToggle={handleToggleDeparture} />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 15,
        margin: 10,
        height: 120,
        backgroundColor: 'snow',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',

        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,

    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginLeft: 20,
        marginTop: 5,
    },
    bottom: {

    },
    switch: {
        marginRight: 10,
    },
    icon: {
        fontSize: 32,
        color: 'grey',
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
    },
});

export default StopPlace;