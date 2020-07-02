import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Departure = (props) => {

    const [isEnabled, setIsEnabled] = useState(false);

    function handlePress() {
        props.handleToggle(props.publicCode, props.frontText, !isEnabled);
        setIsEnabled(!isEnabled);
    }


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress} >
                {isEnabled ? <FontAwesome style={styles.icon} name={'bus'} color={'#a2ad00'} /> : <FontAwesome style={styles.icon} name={'bus'} color={'grey'} />}
                <View style={styles.textContainer}>
                    <Text style={styles.text} >{props.publicCode}</Text>
                    <Text style={styles.text} >{props.frontText}</Text>
                </View>

            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 11,
        alignItems: 'center',
    },
    icon: {
        fontSize: 38,
        alignSelf: 'center',
    },
    text: {
        fontSize: 18,
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

export default Departure;