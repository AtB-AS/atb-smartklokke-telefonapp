import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Departure = (props) => {

    const [isEnabled, setIsEnabled] = useState(false);
    const [isDistrictBus, setIsDistrictBus] = useState(false);

    useEffect(() => {
        if (props.publicCode.length > 2) {
            setIsDistrictBus(true);
        }
    }, [])

    function handlePress() {
        props.handleToggle(props.publicCode, props.frontText, !isEnabled);
        setIsEnabled(!isEnabled);
        console.log(isDistrictBus, isEnabled);
    }


    return (
        <SafeAreaView style={[
            styles.container,
            isEnabled ? (isDistrictBus ? styles.containerEnabledDistrictBus : styles.containerEnabledCityBus) : (isDistrictBus ? styles.containerDisabledDistrictBus : styles.containerDisabledCityBus),
            isDistrictBus ? styles.containerDistrictBus : styles.containerCityBus,

        ]}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress} >
                <View style={styles.top}>
                    <FontAwesome style={styles.icon} name={'bus'} color={'#FFFFFF'} />
                    <Text style={styles.text} >{props.publicCode}</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.text} numberOfLines={2} >{props.frontText}</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 15,
        margin: 11,
        alignItems: 'center',
        borderWidth: 2,
        flexDirection: 'column',
        width: 125,
        height: 90,
    },
    containerDistrictBus: {
        borderColor: '#007C92',
    },
    containerCityBus: {
        borderColor: '#828A00',
    },
    containerEnabledCityBus: {
        backgroundColor: '#828A00',
    },
    containerDisabledCityBus: {
        backgroundColor: '#353535',
    },
    containerEnabledDistrictBus: {
        backgroundColor: '#007C92',
    },
    containerDisabledDistrictBus: {
        backgroundColor: '#353535',
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        //justifyContent: 'space-between',

    },
    icon: {
        fontSize: 28,
        alignSelf: 'center',
        marginRight: 5,
    },
    text: {
        fontSize: 18,
        textAlign: 'left',
        color: 'white',

    },
    touchableOpacity: {
        flexDirection: 'column',
        padding: 10,
        width: '100%',
        height: '100%',

    },
    textContainer: {
        marginLeft: 5,
    },

});

export default Departure;