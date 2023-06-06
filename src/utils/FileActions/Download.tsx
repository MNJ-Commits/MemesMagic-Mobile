import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { DownloadFileOptions, downloadFile, writeFile } from 'react-native-fs';
var RNFS = require('react-native-fs');

export const DownloadCustomGif  = async ( remoteURL: string, datetime:string, header:any, setDownloading: any )=>{

    //Define path and directory to store files to
    // const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.png`
    const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.gif`
    console.log('remoteURL: ',remoteURL);

    //Define options
    const options: DownloadFileOptions = {
        // fromUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
        fromUrl: remoteURL,
        toFile: filePath,
        headers: header
    } 

    let response = downloadFile(options);
    return response.promise.then(async (res: any) => {
        setDownloading(false)
        console.log('res: ', res, filePath);    
         // TO SAVE GIF'S TO IOS PHOTO 
        await CameraRoll.save(remoteURL).then((res:any)=>{
            console.log('res: ', res);
        }).catch((error:any)=>{
            console.log('error: ', error);
        })
    }).catch((error:any)=>{
        setDownloading(false)
        console.log('error: ', error);
    })
}

// // Download Files
export const DownloadGiphyGif = async ( datetime:string, header:any, setDownloading: any, BannerURI: string )=>{

    setDownloading(true)
    //Define path and directory to store files to
    const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.gif`

    await RNFetchBlob
        .fetch('POST', 'http://18.143.157.105:3000/giphy/render',
            header, JSON.stringify({
                "banner_url": `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                "giphy_url":  gifData?.src
            }))
            .then(async (response) =>{ 
                if(response.info().status==200){
                    // TO SAVE GIF'S TO IOS LIBRARY                            
                    writeFile(filePath, response.base64(), 'base64')
                    .then((writeFileReposne)=> {
                        console.log('writeFileReposne: ', writeFileReposne);
                    }).catch((writeFile:any)=>{
                        console.log('writeFile error: ',writeFile) 
                    })
                    console.log('filePath: ', filePath);
                
                    RNFS.exists(filePath).then(async (status: any)=>{
                       // TO SAVE GIF'S TO IOS PHOTO 
                        await CameraRoll.save(filePath,).then((res:any)=>{
                            console.log('res: ', res);
                            setDownloading(false)
                        }).catch((error:any)=>{
                            setDownloading(false)
                            console.log('error: ', error);
                        })
                    })
                }
            }).catch((writeFile:any)=>{
                setDownloading(false)
                console.log('writeFile error: ',writeFile) 
            })
            console.log('filePath: ', filePath);
            
}
