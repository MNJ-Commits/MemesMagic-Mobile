import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
} from 'react-native-permissions';

export const checkLibraryPermissions = async () => {
  return new Promise<any>(async (resolve, reject) => {
    await checkMultiple([
      // iOS default modal checks for permissions with our message for photos
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    ])
      .then((statuses: any) => {
        // console.log('statuses: ', statuses);

        if (
          statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted' &&
          statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY] === 'granted'
        ) {
          resolve(true); // returns to .then in parent
        } else {
          resolve(false); // returns to .catch in parent
        }
      })
      .catch((checkMultipleError: any) => {
        reject(false);
        console.log('checkMultipleError: ', checkMultipleError);
      });
  });
};

export const requestLibraryPermissions = () => {
  return new Promise<any>(async (resolve, reject) => {
    await requestMultiple([
      // iOS default modal asks for permissions with our messagefor photos
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    ])
      .then((requestMultipleReponse: any) => {
        resolve(true);
      })
      .catch(requestMultipleError => {
        console.log('requestMultipleError: ', requestMultipleError);
      });
  });
};
