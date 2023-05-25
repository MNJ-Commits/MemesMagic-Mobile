//
//  MessagesManager.swift
//  MessagesExtension
//  Created by Nouman on 24/03/2023.
//
import Foundation
import Messages



@objc(MessagesManager)
class MessagesManager: NSObject {
//
//  @objc
//  func constantsToExport() -> [AnyHashable : Any]! {
//    return ["initialString": "Hello REACT from native ios"]
//  }
//
//  private var textString = ""
//
//  @objc
//  func Sentence() {
//    textString = "Call me from React Native JS"
////    print(textString)
//  }
//
//
//  @objc
//  func getInitialString(_ callback: RCTResponseSenderBlock) {
//    callback([textString])
//  }
//
//
//  @objc
//  func checkString(
//    _ resolve: RCTPromiseResolveBlock,
//    rejecter reject: RCTPromiseRejectBlock
//  ) -> Void {
//    print(textString)
//    if textString.isEmpty {
//      print("Yes")
////      let error = NSError(domain: "", code: 200, userInfo: nil)
////      reject("E_COUNT", "string cannot be empty", error)
//    } else {
//      print("No")
////      textString = ""
////      resolve("string was updated")
//    }
//  }
  
  
  
  
  let messagesVC: MessagesViewController

  static func moduleName() -> String! {
    return "MessagesManager"
  }

  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  init(messagesVC: MessagesViewController) {
    self.messagesVC = messagesVC
  }

//  @objc func showLoadingView() {
//    DispatchQueue.main.async {
//      self.messagesVC.loadingView?.isHidden = false
//    }
//  }
//
//  @objc func hideLoadingView() {
//    DispatchQueue.main.async {
//      self.messagesVC.loadingView?.isHidden = true
//    }
//  }

  @objc func getPresentationStyle(_ callback: RCTResponseSenderBlock) {
    callback([Mappers.presentationStyleToString(style: self.messagesVC.presentationStyle)])
  }

  @objc func updatePresentationStyle(_ style: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let presentationStyle: MSMessagesAppPresentationStyle = (
      style == "compact" ? .compact : .expanded
    )

    self.messagesVC.requestPresentationStyle(presentationStyle)

    resolve(style)
  }

  @objc func getActiveConversation(_ callback: @escaping RCTResponseSenderBlock) {
    guard let conversation = self.messagesVC.activeConversation else {
      return callback([])
    }

    callback([
      Mappers.conversationToObject(conversation: conversation),
      conversation.selectedMessage != nil ? Mappers.messageToObject(message: conversation.selectedMessage!) : []
    ])
  }

  private func createLayout(_ layoutData: [String: String]) -> MSMessageLayout {
    let layout = MSMessageTemplateLayout()

    if let imageName = layoutData["imageName"] {
      if let image = UIImage(named: imageName) {
        layout.image = image
      } else{
        layout.image = UIImage(named: "Requested")
      }
    }
    layout.imageTitle = layoutData["imageTitle"]
    layout.imageSubtitle = layoutData["imageSubtitle"]
    layout.caption = layoutData["caption"]
    layout.subcaption = layoutData["subcaption"]
    layout.trailingCaption = layoutData["trailingCaption"]
    layout.trailingSubcaption = layoutData["trailingSubcaption"]
    return layout
  }

  @objc func composeMessage(_ messageData: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let conversation = self.messagesVC.activeConversation else {
      return reject("ERROR", "There's no conversation", nil)
    }

    let session = conversation.selectedMessage?.session ?? MSSession()

    let message = MSMessage(session: session)
    message.layout = self.createLayout(messageData["layout"] as! [String : String])
    message.summaryText = messageData["summaryText"] as? String
    message.url = URL(string: messageData["url"] as! String)

    conversation.insert(message) { (error) in
      if error != nil {
        return reject("ERROR", "Unable to insert message", error)
      }

      return resolve(Mappers.messageToObject(message: message, withParticipiantIdentifier: false))
    }
  }

//  @objc func openURL(_ urlString: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
//    guard let url = URL(string: urlString) else {
//      return reject("ERROR", "Unable to construct url", nil)
//    }
//
//    self.messagesVC.extensionContext?.open(url, completionHandler: { (success) in
//      guard success == true else {
//        return reject("ERROR", "Unable to navigate to url", nil)
//      }
//
//      return resolve(url)
//    })
//  }
}
