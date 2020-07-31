import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, } from 'react-native';

const NotificationTime = (props) => {

    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        setIsEnabled(props.initialEnabled);
    }, []);

    function handlePress() {
        props.handleToggle(props.time, !isEnabled);
        setIsEnabled(!isEnabled);
    }


    return (
        <SafeAreaView style={[styles.container, isEnabled ? styles.enabled : styles.disabled]}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress} >
                <Text style={styles.text} >{props.time + ' min'}</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 16,
        margin: 5,
        height: 35,
        width: 55,
    },
    enabled: {
        backgroundColor: '#828A00',
    },
    disabled: {
        backgroundColor: '#353535',
    },
    text: {
        fontSize: 12,
        color: '#FFFFFF',
        //marginRight: 5,
        textAlign: 'center',
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },

});

export default NotificationTime;