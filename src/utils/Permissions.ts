import { checkMultiple, PERMISSIONS, requestMultiple } from "react-native-permissions";

export const checkLibraryPermissions = async ()=>{
  return new Promise<any>(async (resolve, reject) => {
    await checkMultiple([
      // iOS default modal checks for permissions with our message for photos
      PERMISSIONS.IOS.PHOTO_LIBRARY, 
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
      // // MemeMagic App Modal checks for permissions for photos but doesn't allowedd
      // PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
    .then((statuses:any) => {            
      // console.log('statuses: ', statuses);
      // statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]==='granted' && 
      if(statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]==='granted' && 
         statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]==='granted'){
        resolve(true)   // returns to .then in parent
      }
      else{        
        resolve(false) // returns to .catch in parent
      }
    }).catch((checkMultipleError:any)=>{
        reject(false)
        console.log('checkMultipleError: ', checkMultipleError);
      
    })
  })
}


export const requestLibraryPermissions = ()=>{

  return new Promise(async ()=>{
    await requestMultiple([
      // iOS default modal asks for permissions with our messagefor photos
      PERMISSIONS.IOS.PHOTO_LIBRARY, 
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY 
      // // MemeMagic App Modal asks for permissions for photos but doesn't allowed
      // PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
    .then((requestMultipleReponse:any) => {        
      // console.log('requestMultipleReponse: ', requestMultipleReponse);        
    })
    .catch((requestMultipleError)=>{
      console.log('requestMultipleError: ', requestMultipleError);
    }) 
  })
   
}
 
    