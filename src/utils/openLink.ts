import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

// External Browser
export const openURL = async (redirect: any) => {
  await Linking.canOpenURL(redirect)
    .then(async supported => {
      if (supported) {
        await Linking.openURL(redirect).catch(error => {
          console.log('Linking openURL error: ', error);
        });
      } else {
        console.log("Don't know how to open URI: " + redirect);
      }
    })
    .catch(error => {
      console.log('canOpenURL linking error: ', error);
    });
};
// In-App Browser
export async function openLink(url: any) {
  try {
    const isAvailable = await InAppBrowser.isAvailable();
    console.log('isAvailable: ', isAvailable);
    if (isAvailable) {
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#453AA4',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
      });
    } else openURL(url);
  } catch (error: any) {
    console.log('isAvailable error: ', error);
    openURL(url);
  }
}
