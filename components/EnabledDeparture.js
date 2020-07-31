import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const EnabledDeparture = (props) => {

    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [publicCode, setPublicCode] = useState('');
    const [frontText, setFrontText] = useState('');


    useEffect(() => {
        setPublicCode(props.id.split('#')[0]);
        setFrontText(props.id.split('#')[1]);
    }, [])


    const Icon = () => {
        return <FontAwesome style={styles.icon} name={'bus'} color={'#FFFFFF'} />;
    };


    function handleLongPress() {
        /*
        var text;
        if (moreInfo === '') {
            text = props.id.split('#')[1];
        }
        else {
            text = '';
        }
        setMoreInfo(text);
        */
        props.handleToggle(publicCode, frontText, false);
    }

    function handleDeleteButtonPress() {
        props.handleToggle(publicCode, frontText, false);
    }

    function handlePress() {
        //props.handleToggle(publicCode, frontText, false);
        /*
        var text;
        if (moreInfo === '') {
            text = props.id.split('#')[1];
        }
        else {
            text = '';
        }
        */
        setShowMoreInfo(!showMoreInfo);
    }


    return (
        <SafeAreaView style={[styles.container, publicCode.length > 2 ? styles.districtbus : styles.cityBus, showMoreInfo ? styles.containerShowMoreInfo : styles.containerShowLessInfo,]}>
            <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress} >
                <Icon />
                <Text style={styles.text} >{publicCode}</Text>
                <Text style={styles.text}>{showMoreInfo ? frontText : ''}</Text>
                {showMoreInfo &&
                    <TouchableOpacity style={styles.deleteButtonContainer} onPress={handleDeleteButtonPress}>
                        <FontAwesome style={styles.icon} name={'times'} color={'#FFFFFF'} />
                    </TouchableOpacity>
                }

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
        margin: 5,
        height: 35,
    },
    containerShowMoreInfo: {

    },
    containerShowLessInfo: {
        width: 57,
    },
    deleteButtonContainer: {
        //backgroundColor: '#FF4747',
        height: '100%',
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3,
    },
    districtbus: {
        backgroundColor: '#007C92',
    },
    cityBus: {
        backgroundColor: '#828A00',
    },
    icon: {
        fontSize: 18,
        marginLeft: 5,
        marginRight: 5,
    },
    text: {
        fontSize: 12,
        color: '#FFFFFF',
        marginRight: 5,
    },
    touchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1
    },

});

export default EnabledDeparture;