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
  func CopyGif(_ remoteURL: String) {
    let url = NSURL(string: remoteURL)
    guard let data: NSData = NSData(contentsOf: url! as URL) else {
      // Handle the case where yourOptionalURL is nil
      print("URL is null")
      return
    }
    UIPasteboard.general.setData(data as Data, forPasteboardType: "com.compuserve.gif")
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
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
