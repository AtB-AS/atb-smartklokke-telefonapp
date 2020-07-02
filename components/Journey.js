import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import FavouriteDeparture from './FavouriteDeparture.js';
import { ScrollView } from 'react-native-gesture-handler';
import createEnturService from '@entur/sdk';



const Journey = (props) => {

  const [stopPlaces, setStopPlaces] = useState([]);
  const [departures, setDepartures] = useState([]);
  const service = createEnturService({ clientName: 'AtB-smartklokke' });


  useEffect(() => {
    let mounted = true;

    var stopPlaceIds = [];
    props.departures.forEach(dep => stopPlaceIds.push(dep.stopPlaceId));

    var departureIds = [];
    var newDepartures = [];
    props.departures.forEach(dep => departureIds.push(dep.publicCode + dep.frontText));


    async function callService() {
      try {
        const params = {
          timeRange: 86400,
        }
        const result = await service.getDeparturesFromStopPlaces(stopPlaceIds, params);
        if (mounted) {

          var stops = [];
          result.forEach(dep => {
            stops.push({
              stopPlace: dep.id,
              departures: dep.departures
            });
          });

          stops.forEach(stop => {
            stop.departures.forEach(dep => {
              //console.log('dep:', dep.serviceJourney.journeyPattern.line.publicCode + dep.destinationDisplay.frontText);
              //console.log('dep:', dep.expectedArrivalTime);
              if (departureIds.some(d => d === dep.serviceJourney.journeyPattern.line.publicCode + dep.destinationDisplay.frontText)) {
                //console.log(dep.serviceJourney.journeyPattern.line.publicCode + dep.destinationDisplay.frontText + dep.expectedArrivalTime);
                newDepartures.push({
                  publicCode: dep.serviceJourney.journeyPattern.line.publicCode,
                  frontText: dep.destinationDisplay.frontText,
                  expectedArrivalTime: dep.expectedArrivalTime,
                });
              }


            })
          })

          setDepartures(newDepartures);
          setStopPlaces(stops);
          //console.log(props.departures);
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







  return (
    <SafeAreaView style={styles.container}>
      <Text>{props.name}</Text>
      <ScrollView horizontal={true}>
        {departures.map(dep =>
          <FavouriteDeparture key={dep.publicCode} frontText={dep.frontText} publicCode={dep.publicCode} expectedArrivalTime={dep.expectedArrivalTime} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    margin: 10,
    height: 100,
    backgroundColor: '#E8E8E8',

  },
  departureList: {
    flexDirection: 'row',

  },
});

export default Journey;