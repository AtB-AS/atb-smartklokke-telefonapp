//
//  ComplicationController.swift
//  watchApp Extension
//
//  Created by Mats on 18/06/2020.
//

import ClockKit
import WatchKit


class ComplicationController: NSObject, CLKComplicationDataSource {
  
  
  var complicationState: ComplicationState
  
  private override init() {
    self.complicationState = ComplicationState.shared
  }
    
    // MARK: - Timeline Configuration
  
    
    func getSupportedTimeTravelDirections(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationTimeTravelDirections) -> Void) {
      handler([.forward])
    }
    
  
    
    func getTimelineEndDate(for complication: CLKComplication, withHandler handler: @escaping (Date?) -> Void) {
        handler(nil)
    }
    
    func getPrivacyBehavior(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationPrivacyBehavior) -> Void) {
        handler(.showOnLockScreen)
    }
    
    // MARK: - Timeline Population
    
    func getCurrentTimelineEntry(
      for complication: CLKComplication,
      withHandler handler: @escaping (CLKComplicationTimelineEntry?) -> Void)
    {
      // Call the handler with the current timeline entry
      
      
      
      handler(createTimelineEntry(forComplication: complication, date: Date()))
    }
  
  
    func getTimelineEntries(for complication: CLKComplication, before date: Date, limit: Int, withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void) {
      // Call the handler with the timeline entries prior to the given date
      handler(nil)
    }
    
    func getTimelineEntries(
      for complication: CLKComplication,
      after date: Date, limit: Int,
      withHandler handler: @escaping ([CLKComplicationTimelineEntry]?) -> Void)
    {
      // Call the handler with the timeline entries after to the given date
      var entries = [CLKComplicationTimelineEntry]()
      let oneMinute = 1.0 * 60.0
      let twentyFourHours = 24.0 * 60.0 * 60.0
      var current = date.addingTimeInterval(oneMinute)
      let endDate = date.addingTimeInterval(twentyFourHours)
      
      while (current.compare(endDate) == .orderedAscending) && (entries.count < limit) {
          entries.append(createTimelineEntry(forComplication: complication, date: current))
          current = current.addingTimeInterval(oneMinute)
      }
      
      handler(entries)
    }
  
  private func createTimelineEntry(forComplication complication: CLKComplication, date: Date) -> CLKComplicationTimelineEntry {
      
      // Get the correct template based on the complication.
      let template = createTemplate(forComplication: complication, date: date)
      
      // Use the template and date to create a timeline entry.
      return CLKComplicationTimelineEntry(date: date, complicationTemplate: template)
  }
  
  private func createTemplate(forComplication complication: CLKComplication, date: Date) -> CLKComplicationTemplate {
      switch complication.family {
      case .modularLarge:
          return createModularLargeTemplate(forDate: date)
      case .graphicCorner:
        return createGraphicCornerTemplate(forDate: date)
      case .graphicCircular:
        return createGraphicCircularTemplate(forDate: date)
      @unknown default:
          fatalError("*** Unknown Complication Family ***")
      }
  }
  
  private func createModularLargeTemplate(forDate date: Date) -> CLKComplicationTemplate {
    
    let departure = self.complicationState.getDepartureForDate(forDate: date)
    
    
      // Create the template using the providers.
      let template = CLKComplicationTemplateModularLargeStandardBody()
      let imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "ModularLarge")!)
      template.headerImageProvider = imageProvider
      template.headerTextProvider = CLKSimpleTextProvider(text: departure["publicCode"]!)
      template.body1TextProvider = CLKSimpleTextProvider(text: departure["frontText"]!)
      template.body2TextProvider = CLKSimpleTextProvider(text: departure["arrivalTime"]!)
      return template
  }
  
  private func createGraphicCornerTemplate(forDate date: Date) -> CLKComplicationTemplate {
    
    
    
      // Create the template using the providers.
      let template = CLKComplicationTemplateGraphicCornerTextImage()
      template.imageProvider = CLKFullColorImageProvider(fullColorImage: UIImage(named: "ModularLarge")!)
      template.textProvider = CLKSimpleTextProvider(text: "AtB")
      return template
  }
  
  private func createGraphicCircularTemplate(forDate date: Date) -> CLKComplicationTemplate {
    let template = CLKComplicationTemplateGraphicCornerCircularImage()
    template.imageProvider = CLKFullColorImageProvider(fullColorImage: UIImage(named: "ModularLarge")!)
    return template
  }
    
    // MARK: - Placeholder Templates
    
    func getLocalizableSampleTemplate(
      for complication: CLKComplication,
      withHandler handler: @escaping (CLKComplicationTemplate?) -> Void)
    {
        // This method will be called once per supported complication, and the results will be cached
      
        switch complication.family {
          case .modularLarge:
              let template = CLKComplicationTemplateModularLargeStandardBody()
              let imageProvider = CLKImageProvider(onePieceImage: UIImage(named: "ModularLarge")!)
              template.headerImageProvider = imageProvider
              template.headerTextProvider = CLKSimpleTextProvider(text: "Linjenummer")
              template.body1TextProvider = CLKSimpleTextProvider(text: "Linjenavn")
              template.body2TextProvider = CLKSimpleTextProvider(text: "Tid")
              handler(template)
        
        case .graphicCorner:
          let template = CLKComplicationTemplateGraphicCornerTextImage()
          template.imageProvider = CLKFullColorImageProvider(fullColorImage: UIImage(named: "ModularLarge")!)
          template.textProvider = CLKSimpleTextProvider(text: "AtB")
          
        case .graphicCircular:
          let template = CLKComplicationTemplateGraphicCircularImage()
          template.imageProvider = CLKFullColorImageProvider(fullColorImage: UIImage(named: "ModularLarge")!)
          
           default:
               preconditionFailure("Complication family not supported")
           }
    }
    
}
