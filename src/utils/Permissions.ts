import { checkMultiple, PERMISSIONS, requestMultiple } from "react-native-permissions";

export const checkLibraryPermissions = async ()=>{
  return new Promise<any>(async (resolve, reject) => {
    await checkMultiple([
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
    ])
    .then((statuses:any) => {            
      console.log('statuses: ', statuses);
      if(statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]==='granted' && statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]==='granted'){
        resolve(true)   // returns to .then in parent
      }
      else{        
        resolve(false) // returns to .catch in parent
      }
    }).catch((error:any)=>{
        reject(false)
        console.log('error: ', error);
      
    })
  })
}


export const requestLibraryPermissions = ()=>{
  
        requestMultiple([
          PERMISSIONS.IOS.MEDIA_LIBRARY,
          PERMISSIONS.IOS.PHOTO_LIBRARY
        ])
        .then((statuses:any) => {        
          console.log('statuses: ', statuses);        
        })
        .catch(()=>{
        })    
}
 
    