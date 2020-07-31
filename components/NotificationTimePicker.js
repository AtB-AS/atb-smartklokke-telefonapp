import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, Switch, View, Button, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Departure from './Departure.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const NotificationTimePicker = (props) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [time, setTime] = useState(props.initialTime);



    useEffect(() => {
        //var newDate = new Date().setHours(24, 0, 0, 0);

        //setDate(newDate);
        setTime(props.initialTime);
    }, [props.initialTime]);




    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        var timeString = date.toTimeString().substring(0, 5);
        setTime(timeString);
        props.handleSetTime(timeString);
        hideDatePicker();
    };


    return (
        <SafeAreaView style={styles.container}>

            <TouchableOpacity style={styles.touchableOpacity} onPress={showDatePicker}>
                <Text style={styles.text}>{props.name}</Text>
                <Text style={styles.text}>{time}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                cancelTextIOS="Avbryt"
                confirmTextIOS="Velg"
                headerTextIOS="Velg Tidspunkt"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

        </SafeAreaView>
    );
};




const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#353535',
        flexDirection: 'column',
        height: 40,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,

    },
    touchableOpacity: {
        height: 40,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 14,
        color: 'white',
        margin: 5,
    },
});

export default NotificationTimePicker;