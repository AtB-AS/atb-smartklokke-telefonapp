import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import FavouriteDeparture from './FavouriteDeparture.js';
import createEnturService from '@entur/sdk';



const Journey = (props) => {

  const [stops, setStops] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [timeString, setTimeString] = useState('');
  const [titleString, setTitleString] = useState('');
  const [notificationDays, setNotificationDays] = useState([]);
  const [notificationTimes, setNotificationTimes] = useState([]);
  const service = createEnturService({ clientName: 'AtB-smartklokke' });


  useEffect(() => {
    setTimeString(props.notificationStartTime + '-' + props.notificationEndTime);
    setTitleString(props.name);
    var enabledNotificationDays = [];
    props.notificationDays.forEach(day => {
      if (day.enabled) {
        enabledNotificationDays.push(day);
      }
    });
    var enabledNotificationTimes = [];
    props.notificationTimes.forEach(time => {
      if (time.enabled) {
        enabledNotificationTimes.push(time);
      }
    });
    setNotificationDays(enabledNotificationDays);
    setNotificationTimes(enabledNotificationTimes);
    setStops(props.stopList);
    const interval = setInterval(() => {
      updateRealTime();
    }, 60000);
    return () => clearInterval(interval);

  }, []);



  async function updateRealTime() {
    var stopPlaceIds = [];
    props.stopList.forEach(stop => {
      stopPlaceIds.push(stop.id);
    });
    var JourneyDepartures = [];
    props.stopList.forEach(stop => {
      stop.departures.forEach(dep => {
        JourneyDepartures.push({
          publicCode: dep.split('#')[0],
          frontText: dep.split('#')[1],
        });
      })
    });
    var realTimeDeps = [];
    try {
      const params = {
        timeRange: 86400,
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
    } catch (error) {
      console.log(error);
    }
    setDepartures(realTimeDeps);
  }

  function toggleSwitch() {
    setIsEnabled(!isEnabled);
  }

  function toggleOpen() {
    if (isOpen) {
      setDepartures([]);
    }
    else {
      updateRealTime();
    }
    setIsOpen(!isOpen);
  }

  function handleEditPress() {
    props.handleEdit(props.name);
  }

  function handleDeletePress() {
    props.handleDelete(props.name);
  }


  return (
    <SafeAreaView style={[styles.container, isOpen ? styles.containerOpen : styles.containerClosed]}>
      <TouchableOpacity style={styles.topContainer} onPress={toggleOpen}>
        <View style={styles.textContainer} >
          <Text style={styles.subTitle}>{timeString}</Text>
          <Text style={styles.title}>{titleString}</Text>
          <View style={styles.daysContainer}>
            {notificationDays.map(day => <Text key={day.name} style={styles.subTitle}>{day.name}</Text>)}
          </View>
          <View style={styles.daysContainer}>
            {notificationTimes.map(time => <Text key={time.time} style={styles.subTitle}>{time.time} min</Text>)}
          </View>
        </View>
        <View style={styles.switchContainer}>
          <Switch style={styles.switch} value={isEnabled} onValueChange={toggleSwitch} />
        </View>
      </TouchableOpacity>
      {isOpen &&
        <View style={styles.bottomContainer}>
          {departures.length > 0 && stops.map(stop =>
            <View key={stop.name}>
              <Text style={styles.subTitle}>{stop.name}</Text>
              <ScrollView style={styles.departuresContainer} horizontal={true} contentContainerStyle={styles.contentContainer}>
                {departures.map(dep => {
                  if (dep.stopPlaceId == stop.id) {
                    return <FavouriteDeparture
                      key={dep.publicCode + dep.frontText + dep.expectedArrivalTime + dep.quayName}
                      publicCode={dep.publicCode}
                      frontText={dep.frontText}
                      expectedArrivalTime={dep.expectedArrivalTime}
                      quayName={dep.quayName}
                    />
                  }
                })}
              </ScrollView>
            </View>
          )}
          {departures.length == 0 &&
            <ActivityIndicator style={styles.loadingIcon} size="large" color="#FFFFFF" />
          }
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleEditPress}>
              <Text style={styles.buttonTextNormal}>Rediger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeletePress}>
              <Text style={styles.buttonTextRed}>Slett</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    margin: 10,
    backgroundColor: '#1B1B1B',
    flex: 1,
  },
  topContainer: {
    height: 120,
    flexDirection: 'row',
  },
  bottomContainer: {
    backgroundColor: '#1B1B1B',
    borderTopWidth: 2,
    borderTopColor: '#2A2A2A',
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
  },
  containerClosed: {
    height: 120,
  },
  containerOpen: {

  },
  textContainer: {
    justifyContent: 'space-between',
    padding: 10,
    flex: 1,
  },
  daysContainer: {
    flexDirection: 'row',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  subTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 5,
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  switch: {
    marginRight: 10,
  },
  departuresContainer: {
    marginBottom: 15,
    height: 50,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#353535',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    height: 30,
  },
  buttonTextNormal: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonTextRed: {
    color: '#FF4747',
    fontSize: 16,
  },
  buttonContainer: {
    margin: 10,
  },
  loadingIcon: {
    margin: 15,
  },
});

export default Journey;