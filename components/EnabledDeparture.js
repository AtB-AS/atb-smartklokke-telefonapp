import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const EnabledDeparture = (props) => {

    const [moreInfo, setMoreInfo] = useState('');


    const Icon = () => {
        return <FontAwesome style={styles.icon} name={'bus'} color={'#a2ad00'} />;
    };


    function handleLongPress() {
        var text;
        if (moreInfo === '') {
            text = props.id.split('#')[1];
        }
        else {
            text = '';
        }
        setMoreInfo(text);
    }

    function handlePress() {
        //props.handleToggle(publicCode, frontText, false);
        var text;
        if (moreInfo === '') {
            text = props.id.split('#')[1];
        }
        else {
            text = '';
        }
        setMoreInfo(text);
    }


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
                <View style={styles.column}>
                    <Icon />
                    <Text style={styles.text} >{props.id.split('#')[0]}</Text>
                </View >

                <View style={styles.column}>
                    <Text style={styles.text}>{moreInfo}</Text>
                </View>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
    },
    icon: {
        fontSize: 28,
        alignSelf: 'center',
        margin: 5,
    },
    text: {
        fontSize: 12,
        alignSelf: 'center',
    },
    touchableOpacity: {
        flexDirection: 'row',
        borderColor: 'grey',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'center',
    },

});

export default EnabledDeparture;