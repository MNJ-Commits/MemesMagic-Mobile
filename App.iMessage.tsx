import React, { useEffect } from 'react';
import { NativeModules, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { downloadFile, DownloadFileOptions  } from 'react-native-fs';



const { MessagesManager, MessagesEventEmitter } = NativeModules;

// Call from JS to print in xcode console
// MessagesManager.Sentence()

// return a string from swift to log in JS console 
// console.log("MessagesManager: ", MessagesManager.initialString );

// Call from JS to log in JS console with call back
// MessagesManager.getInitialString((value: string)=>{
//   // console.log("My string: " + value)
// })
// const MessagesEvents = new NativeEventEmitter(MessagesEventEmitter);

function handlePromise() {
  console.log('Calling Promise');
  
  MessagesManager.checkString()
    .then((res: any) => console.log("then: ", res))
    .catch((e: { message: any; code: any; }) => console.log("check: ", e.message, e.code))
}




const App = ()=> {

  const [messageState, setMessageState] = React.useState({
    presentationStyle: '',
    conversation: null,
    message: null,
  })
  const [imageSrc, setImageSrc] = React.useState('')

  // useEffect(()=>{
  //   MessagesManager
  //     .getPresentationStyle(presentationStyle => this.setState({ presentationStyle }))

  //   MessagesEvents
  //     .addListener('onPresentationStyleChanged', ({ nativeStyle }) => setMessageState({...messageState, presentationStyle: nativeStyle }));

  //   MessagesManager
  //     .getActiveConversation((converse, msg) => setMessageState({...messageState, conversation: converse, message: msg }));

  //   MessagesEvents
  //     .addListener('didReceiveMessage', ({ msg }) => setMessageState({...messageState,  msg }));

  //   MessagesEvents
  //     .addListener('didSelectMessage', ({ msg }) => setMessageState({...messageState,  msg }));

  // },[])

  // onComposeMessage = () => {
  //   MessagesManager.composeMessage({
  //     layout: {
  //       imageName: 'zebra.jpg',
  //       imageTitle: 'Image Title',
  //       imageSubtitle: 'Image Subtitle',
  //     },
  //     summaryText: 'Sent a message from AwesomeMessageExtension',
  //     url: `?timestamp=${Date.now()}&sender=${this.state.conversation.localParticipiantIdentifier}`
  //   })
  //   .then(() => MessagesManager.updatePresentationStyle('compact'))
  //   .catch(error => console.log('An error occurred while composing the message: ', error))
  // }

  // const onTogglePresentationStyle = () => {
  //   console.log('here:',);
  //   MessagesManager
  //     ?.updatePresentationStyle(messageState === 'expanded' ? 'compact' : 'expanded')
  //     .then(presentationStyle => setMessageState({...messageState, presentationStyle }))
  // }


  // console.log(Image.resolveAssetSource(require('/Users/nouman/Downloads/Compressed/rn-input-extensions-blog-main/src/newAssets/D7ED4149-C251-437C-8DC4-A796DF84B6BB.jpg')).uri)
  

  useEffect(()=>{
    // DownloadFiles()
    // OverLayImgae()
    // handlePromise()
  },[])



  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>To get started, edit App.js</Text>
      {/* <TouchableOpacity onPress={()=>{Alert.alert("Call native input servies")}} >
        <Image source={require('./src/stickers/mango.png')} style={{width: 90, height: 90}} />
      </TouchableOpacity> */}
      <TouchableOpacity 
        // onPress={onTogglePresentationStyle }
        onPress={()=>{}}
        // disabled={!messageState?.presentationStyle}
      >
        {/* <Text>Toggle the Presentation Style</Text>           */}
      </TouchableOpacity>

    </View>
  );
   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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











const DownloadFiles = async () => {
      
  //Define path to store file along with the extension
  const path = `/Users/nouman/Downloads/Compressed/rn-input-extensions-blog-main/src/assets/meme.jpeg`;
  //Define options
  const options: DownloadFileOptions = {
    fromUrl: '/Users/nouman/Downloads/Compressed/rn-input-extensions-blog-main/src/assets/meme.jpeg',
    toFile: path,
    headers: { 'Accept': 'application/json',  'Content-Type': 'application/json' }
  }
  //Call downloadFile
  const response = await downloadFile(options);
  return response.promise.then(async res => {
    console.log('res: ', res, path);
})
}
