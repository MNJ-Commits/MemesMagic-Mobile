//
//  Clipboard.m
//  InputDemoApp
//
//  Created by Mac on 14/06/2023.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <MobileCoreServices/UTCoreTypes.h>
#import "Clipboard.h"

@implementation Clipboard

RCT_EXPORT_MODULE(BetterClipboard); // this is how our native module will be named

//RCT_EXPORT_METHOD(CopyGif: (NSString *) urlString) {
//
//
//  let url = URL(string: "https://media.tenor.com/JX-KI9Kz_GIAAAAC/for-free-adam-sandler.gif") else {
//    print("ERROR", "Unable to construct url")
//  }
//
//  let data: NSData = NSData(contentsOf: url)!
//  UIPasteboard.general.setData(data as Data, forPasteboardType: "com.compuserve.gif")
//
//}
RCT_EXPORT_METHOD(addBase64Image:(NSString *)base64Image) {
  
  UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
  [pasteboard setPersistent:YES];
  
  NSData *imageData = [[NSData alloc]initWithBase64EncodedString:base64Image options:NSDataBase64DecodingIgnoreUnknownCharacters];

  [pasteboard setImage:[UIImage imageWithData:imageData]];
  
}


@end

