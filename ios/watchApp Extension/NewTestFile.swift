//
//  NewTestFile.swift
//  smartklokke
//
//  Created by Mats on 07/08/2020.
//

import Foundation
import ClockKit

class ComplicationState {
  static let shared = ComplicationState()
  

 @Published public var busNumber: String
 @Published public var busName: String
 @Published public var time: String
  var departures: Any
  


  private init() {
    self.busNumber = "-"
    self.busName = "-"
    self.time = "-"
    self.departures = Array<[String: Any]>()
  }

  func setNextDeparture(busNumber: String, busName: String, expectedArrival: String) {
    self.busNumber = busNumber
    self.busName = busName
    self.time = expectedArrival
    
    /*
    let server = CLKComplicationServer.sharedInstance()
    for complication in server.activeComplications ?? [] {
        server.reloadTimeline(for: complication)
    }
 */
 
 
 
  }
}
