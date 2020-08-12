//
//  ComplicationState.swift
//  watchApp Extension
//
//  Created by Mats on 03/08/2020.
//

import Foundation
import ClockKit
import Combine

class ComplicationState: ObservableObject {
  
  static let shared = ComplicationState()
  
  @Published public var departures: [[String: String]]
  


  private init() {
    self.departures = [[String: String]]()
  }
  
  
  
  public func getDepartureForDate(forDate date: Date) -> [String: String] {
      
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy/MM/dd HH:mm"
    var departure = [:] as [String: String]
    
    for (_, dep) in departures.enumerated() {
      let departureDate = formatter.date(from: dep["dateFormatter"]!)!
      if (date < departureDate) {
        departure = dep
        break
      }
    }
    
    return departure
      
  }
  
  

}
