import { checkMultiple, PERMISSIONS, requestMultiple } from "react-native-permissions";

export const checkLibraryPermissions = async ()=>{
  return new Promise<any>(async (resolve, reject) => {
    await checkMultiple([
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
    ])
    .then((statuses:any) => {            
      // console.log('statuses: ', statuses);
      if(statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]==='granted' && 
         statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]==='granted' && 
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
  
        requestMultiple([
          PERMISSIONS.IOS.MEDIA_LIBRARY,
          PERMISSIONS.IOS.PHOTO_LIBRARY,
          PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
        ])
        .then((requestMultipleReponse:any) => {        
          console.log('requestMultipleReponse: ', requestMultipleReponse);        
        })
        .catch((requestMultipleError)=>{
          console.log('requestMultipleError: ', requestMultipleError);
          
        })    
}
 
    