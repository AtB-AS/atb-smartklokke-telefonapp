import Foundation
import WatchKit
import WatchConnectivity

class InterfaceController: WKInterfaceController, WCSessionDelegate {
  
  @IBOutlet weak var departureTable: WKInterfaceTable!
  
  //@IBOutlet weak var titleLabel: WKInterfaceLabel!
  
  
  
  
  
  var session: WCSession?
  var complicationState: ComplicationState

  // Initializes the interface controller with the specified context data
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
    if WCSession.isSupported() {
      self.session = WCSession.default
      self.session?.delegate = self
      self.session?.activate()
    }
    
  }
  
  private override init() {
    self.complicationState = ComplicationState.shared
  }
  
  
    
    
    
  // Called when the activation of a session finishes
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
  
  

  // Called when an immediate message arrives
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    
  }
  
  
  func session(_ session: WCSession,
               didReceiveUserInfo userInfo: [String : Any]) {
    
    if (userInfo["initialMessage"] as! Bool) {
      self.complicationState.departures = [[String: String]]()
    }
    
    if (userInfo["publicCode"] != nil) {
      
      let departureDictionary = ["publicCode": userInfo["publicCode"] as! String,
                                 "frontText": userInfo["frontText"] as! String,
                                 "arrivalTime": userInfo["arrivalTime"] as! String,
                                 "dateFormatter": userInfo["dateFormatter"] as! String,
                                 "id": userInfo["id"] as! String,
                                 "stopPlaceName": userInfo["quayName"] as! String]
      
      
      self.complicationState.departures.append(departureDictionary)
 
      
      departureTable.setNumberOfRows( self.complicationState.departures.count, withRowType: "DeparturesTableRowController")
      
      for (index, departure) in self.complicationState.departures.enumerated() {
        let publicCodeRow = departureTable.rowController(at: index) as! DeparturesTableRowController
        publicCodeRow.publicCode.setText(departure["publicCode"])
        
        let stopPlaceRow = departureTable.rowController(at: index) as! DeparturesTableRowController
        stopPlaceRow.stopPlaceLabel.setText(departure["stopPlaceName"])
        
        let timeRow = departureTable.rowController(at: index) as! DeparturesTableRowController
        timeRow.arrivalTime.setText(departure["arrivalTime"])
      }
      
    }
    
    
    
    
    
  }
 
  
  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    
  }
  
  
 
  
  
  
  
  
  
 
  
  
}
