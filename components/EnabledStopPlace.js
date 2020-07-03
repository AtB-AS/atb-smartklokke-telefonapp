import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import EnabledDeparture from './EnabledDeparture.js';

const EnabledStopPlace = (props) => {


    function handleToggle(publicCode, frontText, isEnabled) {
        props.handleToggle(publicCode, frontText, props.name, props.id, isEnabled);
    }


    return (
        <SafeAreaView style={styles.container}>
            {props.departures.map(dep =>
                <EnabledDeparture key={dep} id={dep} handleToggle={handleToggle} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    departureList: {
        flexDirection: 'row',
    },
    scrollView: {
        flexDirection: 'row',
        height: 70,
        marginBottom: 10,
    },
    icon: {
        fontSize: 38,
        alignSelf: 'center',
    },
    text: {
        fontSize: 14,
        textAlign: 'left',

    },
    touchableOpacity: {
        flexDirection: 'row',
        borderColor: 'grey',

    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 5,
    },

});

export default EnabledStopPlace;