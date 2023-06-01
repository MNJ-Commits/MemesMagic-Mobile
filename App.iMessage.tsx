import React, { useEffect } from 'react';
import { NativeModules, NativeEventEmitter, StyleSheet, Text, TouchableOpacity, View, Image, TouchableHighlight, DevSettings } from 'react-native';
import { downloadFile, DownloadFileOptions  } from 'react-native-fs';
import DevMenu from './DevMenu';


const { MessagesManager, MessagesEventEmitter } = NativeModules;
const MessagesEvents = new NativeEventEmitter(MessagesEventEmitter);


// Call from JS to print in xcode console
// // MessagesManager.Sentence()

// Call from JS to log in JS console i-e return a string from swift
// // console.log("MessagesManager: ", MessagesManager.initialString );

// Call from JS to log in JS console with call back
// // MessagesManager.getInitialString((value: string)=>{
// //   console.log("My string: " + value)
// // })


// Calling Promise
// // function handlePromise() {
  
// //   MessagesManager.checkString()
// //     .then((res: any) => console.log("then: ", res))
// //     .catch((e: { message: any; code: any; }) => console.log("check: ", e.message, e.code))
// // }




const App = ()=> {

  const [messageState, setMessageState] = React.useState<any>({
    presentationStyle: '',
    conversation: null,
    message: null,
  })


  useEffect(()=>{
    MessagesManager
      .getPresentationStyle((presentationStyle: any) => setMessageState({...messageState, presentationStyle}))

    MessagesEvents
      .addListener('onPresentationStyleChanged', ({ presentationStyle }) => setMessageState({...messageState, presentationStyle: presentationStyle }));

    MessagesManager
      .getActiveConversation((converse: any, msg: any) => {
        console.log('getActiveConversation');
        setMessageState({...messageState, conversation: converse, message: msg })
      });

    MessagesEvents
      .addListener('didReceiveMessage', ({ msg }) => {
        setMessageState({...messageState,  message: msg  })
        console.log('didReceiveMessage: ', msg);
    });

    MessagesEvents
      .addListener('didSelectMessage', ({ msg }) => {
        setMessageState({...messageState,  message: msg  })
        console.log('didSelectMessage');
      });

  },[])

  
  const onComposeMessage = () => {
    MessagesManager.composeMessage({
      layout: {
        // imageName: 'sherlock.gif',
        // mediaFileURL: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
        imageTitle: 'American Eagle',
        imageSubtitle: 'Freedom',
      },
      summaryText: 'Sent a message from MessageExtension',
      url: `?timestamp=${Date.now()}&sender=${messageState?.conversation?.localParticipiantIdentifier}`
    })
    // .then(() => MessagesManager.updatePresentationStyle('compact'))
    .then((message: any) => console.log('Successfuly compossed a message: ', message))
    .catch((error: any) => console.log('An error occurred while composing the message: ', error))
  }

 

  const onTogglePresentationStyle = () => {
    console.log('here:',);
    MessagesManager
      ?.updatePresentationStyle(messageState.presentationStyle === 'expanded' ? 'compact' : 'expanded')
      .then((presentationStyle: any) => setMessageState({...messageState, presentationStyle }))
  }


  

  useEffect(()=>{
    // handlePromise()
  },[])




  return (
    <View style={styles.container}>
      {/* <DevMenu /> */}
      <View style={styles.wrapper}>
        <TouchableHighlight style={styles.button} onPress={()=> DevSettings.reload()}>
          <Text style={styles.buttonText}>
            Live Reload Application
          </Text>
        </TouchableHighlight>
      </View>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>To get started, edit App.js</Text>
      <TouchableOpacity 
        onPress={onTogglePresentationStyle }
        // disabled={!messageState?.presentationStyle}
        style={{marginVertical:20}}
      >
        <Text>Toggle the Presentation Style</Text>          
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onComposeMessage }
        // disabled={!messageState?.presentationStyle}
      >
        <Text style={{fontFamily:'Lucita-Regular', fontSize:18}} >Compose a message</Text>          
          </TouchableOpacity>
          {messageState?.message && messageState?.message?.url && (
              <View style={{
                marginTop: 25,
                alignItems: 'center',
              }}>
                <Text>
                  URL from the message:
                </Text>

                <Text style={{
                  fontWeight: 'bold',
                  paddingLeft: 24,
                  paddingRight: 24,
                }}>
                  {messageState?.message?.url}
                </Text>
              </View>
            )}
    </View>
  );
   
}

const styles = StyleSheet.create({

  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 2,
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default  App 



















































// //
// // App.iMessage.js
// //

// import React, { Component } from 'react';
// import {
//   Text,
//   View,
//   NativeModules,
//   NativeEventEmitter,
//   Button,
// } from 'react-native';
// import DevMenu from './DevMenu';

// const { MessagesManager, MessagesEventEmitter } = NativeModules;
// const MessagesEvents = new NativeEventEmitter(MessagesEventEmitter);

// export default class App extends Component {
//   state = {
//     presentationStyle: '',
//     conversation: null,
//     message: null,
//   }

//   componentDidMount() {
//     MessagesManager
//       .getPresentationStyle(presentationStyle => this.setState({ presentationStyle }))

//     MessagesEvents
//       .addListener('onPresentationStyleChanged', ({ presentationStyle }) => this.setState({ presentationStyle }));

//     MessagesManager
//       .getActiveConversation((conversation, message) => this.setState({ conversation, message }));

//     MessagesEvents
//       .addListener('didReceiveMessage', ({ message }) => this.setState({ message }));

//     MessagesEvents
//       .addListener('didSelectMessage', ({ message }) => this.setState({ message }));

//     this.performFakeAsyncTaskAndHideLoadingView()
//   }

//   performFakeAsyncTaskAndHideLoadingView = () => {
//     setTimeout(() => MessagesManager.hideLoadingView(), 1500);
//   }

//   onTogglePresentationStyle = () => {
//     MessagesManager
//       .updatePresentationStyle(this.state.presentationStyle === 'expanded' ? 'compact' : 'expanded')
//       .then(presentationStyle => this.setState({ presentationStyle }))
//   }

//   onComposeMessage = () => {
//     MessagesManager.composeMessage({
//       layout: {
//         imageName: 'zebra.jpg',
//         imageTitle: 'Image Title',
//         imageSubtitle: 'Image Subtitle',
//       },
//       summaryText: 'Sent a message from AwesomeMessageExtension',
//       url: `?timestamp=${Date.now()}&sender=${this.state.conversation.localParticipiantIdentifier}`
//     })
//     .then(() => MessagesManager.updatePresentationStyle('compact'))
//     .catch(error => console.log('An error occurred while composing the message: ', error))
//   }

//   onOpenURL = () => {
//     MessagesManager.openURL('url://test')
//       .then(() => console.log('Successfully opened url!'))
//       .catch(error => console.log('An error occurred while opening the URL: ', error))
//   }

//   onShowLoadingView = () => {
//     MessagesManager.showLoadingView();
//     this.performFakeAsyncTaskAndHideLoadingView();
//   }

//   render() {
//     const { message } = this.state;

//     return (
//       <View>
//         {__DEV__ && <DevMenu />}

//         <Button
//           title="Toggle the Presentation Style"
//           onPress={this.onTogglePresentationStyle}
//           disabled={!this.state.presentationStyle}
//         />

//         <Button
//           title="Compose Message"
//           onPress={this.onComposeMessage}
//         />

//         <Button
//           title="Open URL"
//           onPress={this.onOpenURL}
//         />

//         <Button
//           title="Show Loading View (hides after 3 seconds)"
//           onPress={this.onShowLoadingView}
//         />

//         {message && message.url && (
//           <View style={{
//             marginTop: 25,
//             alignItems: 'center',
//           }}>
//             <Text>
//               URL from the message:
//             </Text>

//             <Text style={{
//               fontWeight: 'bold',
//               paddingLeft: 24,
//               paddingRight: 24,
//             }}>
//               {message.url}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   }
// }






