//
//  ClipboardManager.swift
//  InputDemoApp
//
//  Created by Mac on 16/06/2023.
//

import Foundation


@objc (ClipboardManager)
class ClipboardManager: NSObject {

  
  @objc
  //  Copy Gif from local URL
  func CopyGif(_ localPath: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let url = URL(fileURLWithPath: localPath)
    print("Data  url: \(url)")
    do {
        let data = try Data(contentsOf: url)
        
        // Set the data to the pasteboard
        UIPasteboard.general.setData(data, forPasteboardType: "com.compuserve.gif")
        
        // Optionally, you can display a success message
        print("Data copied to the pasteboard successfully.")
    } catch {
        // Handle errors when reading the file data
        print("Error reading file data: \(error)")
    }
    resolve (true)
  }
  
//  Copy Gif from remote URL
//  func CopyGif(_ remoteURL: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
//    let url = NSURL(string: remoteURL)
//    guard let data: NSData = NSData(contentsOf: url! as URL) else {
//      // Handle the case where yourOptionalURL is nil
//      print("URL is null")
//      return
//    }
//    UIPasteboard.general.setData(data as Data, forPasteboardType: "com.compuserve.gif")
//    resolve (true)
//  }
  
  
  
  
  
  
  
  
  
  
  
  
  
//
//  private var count = 0
//
//  @objc
//  func increament(){
//      count += 1
//    print(count)
//  }
//
//  @objc
//  func constantsToExport() -> [AnyHashable : Any]! {
//      return ["message": "Hello from native code"]
//  }
//
//// Export this module at initial thread before any JS code execution instead of background thread
//  @objc
//  static func requiresMainQueueSetup() -> Bool {
//    return true
//  }
  
  
}
