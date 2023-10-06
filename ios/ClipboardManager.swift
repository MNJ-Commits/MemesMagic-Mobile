//
//  ClipboardManager.swift
//  InputDemoApp
//
//  Created by Mac on 16/06/2023.
//

import Foundation


@objc (ClipboardManager)
class ClipboardManager: NSObject {

  

  //  Copy Gif from local URL
  @objc
  func CopyLocalGif(_ localPath: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {

    let url = NSURL(fileURLWithPath: localPath)
    print("Local  url: \(url)")
    do {
      let imgData = try NSData(contentsOf: (url) as URL)
      // Set the data to the pasteboard
      UIPasteboard.general.setData(imgData! as Data, forPasteboardType: "com.compuserve.gif")
        
      // Optionally, you can display a success message
      print("Data copied to the pasteboard successfully.")
      resolve (true)
      
    } catch {
        // Handle errors when reading the file data
        print("Error reading file data: \(error)")
      resolve (false)
    }

  }
  
  
  //  Copy Gif from remote URL
  @objc
  func CopyRemoteGif(_ remoteURL: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let url = NSURL(string: remoteURL)
    guard let data: NSData = NSData(contentsOf: url! as URL) else {
      // Handle the case where yourOptionalURL is nil
      print("URL is null")
      return
    }
    UIPasteboard.general.setData(data as Data, forPasteboardType: "com.compuserve.gif")
    resolve (true)
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
