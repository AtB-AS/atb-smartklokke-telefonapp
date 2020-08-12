//
//  DataStore.swift
//  watchApp Extension
//
//  Created by Mats on 05/08/2020.
//
import Foundation

private let CurrentBusNumberKey = "CurrentBus"
private let CurrentBusArrivalTimeKey = "CurrentBusArrivalTime"
private let LastDepartureDate = "LastDepartureDate"
 
class DataStore {
    let defaults = UserDefaults.standard
 
    var currentBusNumber: Int? {
        get { return defaults.object(forKey: CurrentBusNumberKey) as? Int }
        set { defaults.set(newValue, forKey: CurrentBusNumberKey) }
    }
  
    var currentBusArrivalTime: Int? {
        get { return defaults.object(forKey: CurrentBusArrivalTimeKey) as? Int }
        set { defaults.set(newValue, forKey: CurrentBusArrivalTimeKey) }
    }
 
    var lastMeasurementDate: Date? {
        get { return defaults.object(forKey: LastDepartureDate) as? Date }
        set { defaults.set(newValue, forKey: LastDepartureDate)}
    }
}
