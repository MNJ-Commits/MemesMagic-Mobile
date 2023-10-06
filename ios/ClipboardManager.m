//
//  ClipboardManager.m
//  InputDemoApp
//
//  Created by Mac on 16/06/2023.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ClipboardManager, NSObject)

RCT_EXTERN_METHOD(CopyLocalGif:
                  (NSString *) remoteURL
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(CopyRemoteGif:
                  (NSString *) remoteURL
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)

@end
