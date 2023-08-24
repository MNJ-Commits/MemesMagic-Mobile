// Libraries
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, NativeModules, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { DownloadFileOptions, downloadFile, writeFile } from 'react-native-fs';
var RNFS = require('react-native-fs');
import InAppReview from 'react-native-in-app-review';

// SVG's
import BackButton from "../assets/svgs/back-button.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import ShareIcon from "../assets/svgs/shareIcon.svg";
import CopyIcon from "../assets/svgs/copy.svg";
import DownloadSvg from "../assets/svgs/download.svg";

// Hooks
import { checkLibraryPermissions, requestLibraryPermissions } from '../utils/Permissions';
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';
import { loadAppleAccessTokenFromStorage, loadFreeGifAccess, loadIndividualGifData, loadVerifyPaymentFromStorage, storeFreeGifAccess, storeIndividualGifData } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useGetCustomTemplateById } from '../hooks/useGetCustomTemplateById';
import FastImage from 'react-native-fast-image';
import { usePostRateAppStatus } from '../hooks/usePostRateAppStatus';

 

const IndividualGiphScreen = ({navigation, route}:any)=> {    
    
    const [text, setText] = useState<string>('')
    const [textCheck, setTextCheck] = useState<Boolean>(true)
    const [loader, setLoader] = useState<Boolean>(false)
    const [downloading, setDownloading] = useState<Boolean>(false)
    const [sharing, setSharing] = useState<Boolean>(false)
    const [copying, setCopying] = useState<Boolean>(false)
    const [webp, setWebp] = useState<string>('')
    const [verifyPayment, setVerifyPayment] = useState<any>({})
    const [appleAccessToken, setAppleAccessToken] = useState<string>('')
    const [gifData, setGIFData] = useState<any>({})
    const [fileAction, setFileAction] = useState<string>('')
    const [responseTime, setRresponseTime] = useState<any>('')
    const [freeGifAccess, setFreeGifAccess] = useState<boolean>(false)

    // GET Store
    const getter = async () => {
    
        const gif_state = await loadIndividualGifData().catch((error:any)=>{
            console.log('loadIndividualGifData Error: ', error);
        })
        // console.log("gif_state: ",gif_state );
        setGIFData(gif_state) 

        const paymentStatus = await loadVerifyPaymentFromStorage().catch((error:any)=>{
            console.log('loadVerifyPaymentFromStorage Error: ', error);
        })
        console.log("paymentStatus: ",paymentStatus );
        setVerifyPayment(paymentStatus) 
        
        const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
            console.log('loadAppleAccessTokenFromStorage Error: ', error);
        })
        setAppleAccessToken(access_token) 
   
        await loadFreeGifAccess().then((res:any)=>{
            console.log('loadFreeGifAccess res: ', res);
            setFreeGifAccess(res.access) 
        })
        .catch((error:any)=>{
            console.log('loadFreeGifAccess Error: ', error);
        })
    }

    useFocusEffect(
        React.useCallback(() => {
          getter().catch((error:any)=>{
          console.log('getter Error: ', error);
          })
        }, []),
       );
    
    useEffect(()=>{
        if(gifData?.giphy){
            const textSting = gifData?.src2?.split("&w")[0]
            setTextCheck( textSting ? false : true)
            setText(textSting ? decodeURIComponent(textSting?.split("=")[1]) : ""  )
        }
        else if(gifData.defaultText){
            // For custom render 
            renderGifById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "webp",
                "uids": [ gifData.uid ],
                text:[gifData?.defaultText]
            })
            setWebp(gifData.src)
            setTextCheck( gifData.defaultText ? false : true)
            setText(gifData.defaultText)
        }
        else if(route?.params?.uid && !route?.params?.defaultText){
            getTemplateById.mutate({ uid:route?.params?.uid })
        }

        return()=>{}
    },[gifData])
   
    const rateAppStatus: any = usePostRateAppStatus({
        onSuccess: async (res: any) => {
            // console.log("forceAppStatus: ", res);
        },
        onError: (res: any) => console.log('onError: ',res),
      });

    const isAvailable = InAppReview.isAvailable();
      
    const getTemplateById: any = useGetCustomTemplateById({
        onSuccess(res) { 
        // console.log('res: ', res);
        setTextCheck(false)
        setWebp(`http://18.143.157.105:3000${res.template}`) 
        },
        onError(error) {
        console.log('getCustomRenders error: ', error);
        },
    }); 


    const renderGifById: any = usePostCustomRenders({
        onSuccess(res) { 
            // console.log("res: ", res[0].render);     
            setTextCheck(false)
            if(res[0].render.includes('.webp')){
                setWebp(`http://18.143.157.105:3000${res[0].render}`) 
                console.log("webp");
            }
            else {
                console.log("gif");
                if(fileAction==="RequestShareCustomGif")
                    RequestShareCustomGif(`http://18.143.157.105:3000${res[0].render}`)
                else if(fileAction==="RequestDownloadCustomGif")
                    RequestDownloadCustomGif(`http://18.143.157.105:3000${res[0].render}`)
                else if(fileAction==="CopyCustomGif")
                    CopyCustomGif(`http://18.143.157.105:3000${res[0].render}`)

            }
            setLoader(false)
        },
        onError(error) {
            setLoader(false)
            console.log("renderGifById", error);
        },
    }); 


    const textSting = gifData?.src2?.split("&w")[1] 
    let BannerURI: string = ''
    text ? BannerURI+=`?text=${encodeURIComponent(text)}&w`+textSting : gifData?.src2

    // Check Download Permissions to PHOTO'S Gallery
    const DownloadPermissions = ()=> {
        checkLibraryPermissions( ).then((resp:any)=>{
            setDownloading(true);  
            startTime()
            renderGifById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "gif",
                "uids": [ gifData.uid ], 
                text:[text],
            })      
            if(!resp){
                // console.log('resp: ',resp);
                requestLibraryPermissions()
            }
        }).catch((error:any)=>{
            console.log('error resp: ', error);
        })
    }

    // Date & Time as File Name
    var today = ""+new Date()
    const datetime = today.split('GMT')[0].replace(/\:/g, '.').trim().replace(/\ /g, '_')

    const header:any = appleAccessToken ? 
        {  
            'Content-Type': 'application/json', 
            "X-ACCESS-TOKEN": appleAccessToken,  
        }
        :
        { 
            'Content-Type': 'application/json', 
        }

    // DOWNLOAD GIF'S
    const RequestDownloadCustomGif  = async (remoteURL: string)=>{

        const endTime:any = new Date(); 
        const timeDifference = endTime-responseTime
        console.log("remoteURL Response Time: ", timeDifference / 1000) 

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
        const startTime:any = new Date();
        let response = await downloadFile(options);
        return response.promise.then(async (res: any) => {
            console.log('res: ', res, filePath);    
             // TO SAVE GIF'S TO IOS PHOTO 
             const endTime:any = new Date(); 
                const timeDifference = endTime-startTime
                console.log("Download Document Response Time: ", timeDifference / 1000)    

            await CameraRoll.save(remoteURL).then((res:any)=>{
                const endTime:any = new Date(); 
                const timeDifference = endTime-startTime
                console.log("Download Photos Response Time: ", timeDifference / 1000)    
                setDownloading(false)
                // console.log('res: ', res);
                if(freeGifAccess){
                    setFreeGifAccess(false)
                    storeFreeGifAccess({access:false})
                }
            }).catch((error:any)=>{
                setDownloading(false)
                console.log('error: ', error);
            })
        }).catch((error:any)=>{
            setDownloading(false)
            console.log('error: ', error);
        })
    }

    const DownloadGiphyGif = async ()=>{

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
                            if(freeGifAccess){
                                setFreeGifAccess(false)
                                storeFreeGifAccess({access: false})
                            }
                            console.log('writeFileReposne: ', writeFileReposne);
                        }).catch((writeFile:any)=>{
                            setDownloading(false)
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

 
    // SHARE GIF'S
    const RequestShareCustomGif = (remoteURL: string) => {
    
        // 1. Download   2. Share   3. Remove
        let filePath: any;
        // Download
        RNFetchBlob.config({
            fileCache: true,
            path: RNFetchBlob.fs.dirs.LibraryDir + `/${datetime}.gif`
        }).fetch('GET', remoteURL, header).then(async (resp:any) => {
            // setSharing(false)
            filePath = await resp.path();
            let data: any = await resp.base64();            
            return data
        }).then((base64Data:any) => {
            const endTime:any = new Date(); 
            const timeDifference = endTime-responseTime
            console.log("Share Response Time: ", timeDifference / 1000)    
            // Share
            Share.open({
                type: 'image/gif',
                url: `data:image/png;base64,${base64Data}`     // (Platform.OS === 'android' ? 'file://' + filePath)
            }).then((res:any)=>{
                setSharing(false)
                if(freeGifAccess){
                    setFreeGifAccess(false)
                    storeFreeGifAccess({access:false})
                }
                console.log('res: ', res);
            }).catch((error:any)=>{
                setSharing(false)
                console.log('error: ', error);
            });
            // Remove from device's storage
            RNFetchBlob.fs.unlink(filePath);
        }).catch((error:any)=>{
            setSharing(false)
            console.log("error: ",error);
        })
    }

    const ShareGiphyGif=async ()=>{
      
        // 1. Download   2. Share,
        setSharing(true)   
        let data: any;
        await RNFetchBlob.fetch('POST', 'http://18.143.157.105:3000/giphy/render',
            header, JSON.stringify({
                "banner_url": `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                "giphy_url":  gifData?.src
            }) )
            .then(async (response) =>{                
                console.log('reponse: ', response.info().status);
                if(response.info().status==200){
                    setSharing(false)
                    data = await response.base64() 
                    return data
                }
            }).then((base64Data:any) => {
                // Share
                Share.open({
                    type: 'image/gif',
                    url: `data:image/png;base64,${base64Data}`     // (Platform.OS === 'android' ? 'file://' + filePath)
                }).then((res:any)=>{
                    console.log('res: ', res);
                    if(freeGifAccess){
                        setFreeGifAccess(false)
                        storeFreeGifAccess({access:false})
                    }
                }).catch((error:any)=>{
                    setSharing(false)
                    console.log('Share error: ', error);
                });
            }).catch((error:any)=>{ 
                setSharing(false)
                // console.log('fetch error: ', error) 
            });
    }


    // COPY GIF'S
    const CopyCustomGif = (remoteURL: string) => {
        console.log("uid: ", gifData.uid, remoteURL);
        NativeModules.ClipboardManager.CopyGif(remoteURL).then( (resp:any) => { 
            const endTime:any = new Date(); 
            const timeDifference = endTime-responseTime
            console.log("Share Response Time: ", timeDifference / 1000)    
            setCopying(!resp) 
            if(freeGifAccess){
                setFreeGifAccess(false)
                storeFreeGifAccess({access:false})
            }
        })
    }

    const CopyGiphyGif = async ()=>{

        setCopying(true)
        await RNFetchBlob
            .fetch('POST', 'http://18.143.157.105:3000/giphy/render',
                header, JSON.stringify({
                    "banner_url": `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                    "giphy_url":  gifData?.src
                }))
                .then(async (response) =>{ 
                    if(response.info().status==200){
                        let data = await response.base64() 
                        return data
                    }
                }).then((base64Data:any) => {
                    let remoteURL = `data:image/png;base64,${base64Data}`
                    NativeModules.ClipboardManager.CopyGif(remoteURL)
                    setCopying(false)
                    if(freeGifAccess){
                        setFreeGifAccess(false)
                        storeFreeGifAccess({access:false})
                    }
                })
                .catch((writeFile:any)=>{
                    setCopying(false)
                    console.log('writeFile error: ',writeFile) 
                })
    }

    const isValidateInput = () => {
        let string = text.trim()
        if (!string || /^\s*$/.test(string) || /^\.*$/.test(string)){
            Alert.alert("You must enter text to proceed")
            return false
        }
        else if(textCheck && !gifData.giphy){
            Alert.alert("You must render text to proceed")
            return false
        }
        else if(text.length<2){
            Alert.alert("Please enter more text" )
            return false
        } 

        return true
    }

    const StoreIndividualGif = () => {
        if(gifData.giphy)
            {
                storeIndividualGifData({src: gifData.src,  width:gifData.width, height:gifData.height, giphy: gifData.giphy, src2: BannerURI});
                navigation.push('SubscriptionScreen', {returnScreen : 'IndividualGiphScreen'} )
            }
        else{
                storeIndividualGifData({src: webp, width:gifData.width, height:gifData.height, uid: gifData.uid, defaultText:text});
                navigation.push('SubscriptionScreen', {returnScreen : 'IndividualGiphScreen'} )
            }
    }

    // console.log('BannerURI: ', BannerURI);
    // console.log('gifData: ', gifData);
    // console.log('verifyPayment: ', verifyPayment);
    // console.log('appleAccessToken: ', appleAccessToken);
    //  console.log("text.length: ", text.length);
  
    const startTime=()=>{
        const startTime = new Date(); 
        console.log('start time: ', startTime);
        setRresponseTime(startTime)   
    }

    const requestReview = ()=> {
        setTextCheck(false) 
        Alert.alert("Rate Us", "This is a paid feature.  To complete this task for free, please leave a 5 star review",
            [
                {
                text: 'Maybe Later', onPress: () => {
                        if(rateAppStatus.data[0].show_popup===1)
                            DownloadPermissions()
                    }
                },
                {
                text: 'Rate Now', onPress: () => {
            
                    console.log(freeGifAccess, !freeGifAccess);
                    if(!freeGifAccess){
                        setFreeGifAccess(true)
                        storeFreeGifAccess({access:true})
                    }
                    InAppReview.RequestInAppReview()
                    .then((hasFlowFinishedSuccessfully) => {
                    console.log('InAppReview in ios has launched successfully', hasFlowFinishedSuccessfully);
                    
                    if (hasFlowFinishedSuccessfully) {
                        // do something for ios
                    }
                    })
                    .catch((error) => { console.log("RequestInAppReview: ", error) });
                }
            
                }
            ] )
    }

    //   console.log("gifData.src: ",gifData.src);
    //   console.log("freeGifAccess: ",freeGifAccess);
      
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#25282D' }}>
            {gifData.src &&  
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding': undefined }
                keyboardVerticalOffset={20}
            >
                {/* Back Button */}
                <TouchableOpacity 
                    onPress={()=>{ navigation.pop() }}
                    style={{margin:20 }} >
                    <BackButton width={RFValue(25)} height={RFValue(25)}/>
                </TouchableOpacity>
                <ScrollView 
                    style={{flex:1, }} 
                    showsVerticalScrollIndicator={false}
                    // onScrollBeginDrag={()=>Keyboard.dismiss()}
                    contentContainerStyle={{ alignItems:'center', marginHorizontal:RFValue(20), paddingBottom:50 }}
                    keyboardShouldPersistTaps='handled' 
                 >
                    {/* Gif View*/}
                    <View>
                        {/* <Image
                            // source={{uri: gifData?.giphy ? gifData.src : webp }}
                            source={{
                                uri: webp ? webp : gifData.src,  
                                // priority: FastImage.priority.normal, 
                                // cache: 'force-cache' 
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={[{width: '100%', aspectRatio: gifData.width/gifData.height,borderRadius:RFValue(30), margin:RFValue(20),  } ]}
                        />         */}
                        <FastImage
                            // source={{uri: gifData?.giphy ? gifData.src : webp }}
                            source={{
                                uri: webp ? webp : gifData.src,  
                                priority: FastImage.priority.high, 
                                // cache: 'force-cache' 
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={[{width: '100%', aspectRatio: gifData.width/gifData.height,borderRadius:RFValue(30), margin:RFValue(20),  } ]}
                        /> 
                    
                        {
                        gifData.giphy && (text || gifData.defaultText) &&
                            <FastImage 
                                source={appleAccessToken ?
                                    {   uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                                        headers:{ "X-ACCESS-TOKEN": appleAccessToken },
                                        priority: FastImage.priority.normal,
                                    }
                                    :
                                    { uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                                      priority: FastImage.priority.normal,
                                    }
                                }
                                resizeMode={FastImage.resizeMode.contain}
                                style={{
                                    width:'100%', 
                                    aspectRatio: gifData.width/gifData.height,
                                    position:'absolute',
                                    borderRadius:RFValue(30), margin:RFValue(20),
                                }}
                            />
                        }
                        { (!gifData.giphy && !webp )&&
                            <ActivityIndicator size={'small'} style={{zIndex: -1, position:'absolute', alignSelf:'center', top: RFValue(gifData.height/3) }}/>}
                    </View>
                  
                    {/* Copy/Download/Share */}
                    <View style={[{flexDirection:'row', alignItems:'center', justifyContent:'center' }]} >
                        <TouchableOpacity 
                            onPress={ ()=>{
                                if( isValidateInput() ){
                                    if (verifyPayment?.subcription || freeGifAccess){
                                    gifData?.giphy ?
                                        CopyGiphyGif() : 
                                        // For custom .GIF download
                                        setCopying(true); setFileAction("CopyCustomGif"); setTextCheck( textSting ? false : true)
                                        startTime()
                                        renderGifById.mutate({ 
                                            "HQ": true,
                                            "animated_sequence": true,
                                            "render_format": "gif",
                                            "uids": [ gifData.uid ], 
                                            "text":[text],
                                        }) 
                                    } 
                                    else{
                                        if(isAvailable && rateAppStatus.data[0].show_popup===1 && !freeGifAccess)
                                            requestReview() 
                                        else
                                            StoreIndividualGif()
                                    }
                                }
                            }}
                            style={{alignSelf:'center', margin:20 }} >
                            <CopyIcon width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={ ()=>{
                                // if( isValidateInput() ){
                                //     if (verifyPayment?.subcription || freeGifAccess){
                                        gifData?.giphy ? DownloadGiphyGif() : 
                                        // For custom .GIF download
                                        setFileAction("RequestDownloadCustomGif"); 
                                        setTextCheck( textSting ? false : true)
                                        DownloadPermissions()
                                //     } 
                                //     else{
                                //         if(isAvailable && rateAppStatus.data[0].show_popup===1 && !freeGifAccess)
                                //             requestReview() 
                                //         else
                                //             StoreIndividualGif()
                                //     }
                                // }
                            }}
                            style={{alignSelf:'center', margin:20 }} >
                            <DownloadSvg width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={ ()=>{
                                if(isValidateInput() ){
                                    // if (verifyPayment?.subcriptio || freeGifAccess){
                                        gifData?.giphy ? ShareGiphyGif() 
                                        : // For custom .GIF download
                                        setSharing(true);   setFileAction("RequestShareCustomGif");   setTextCheck( textSting ? false : true)
                                        startTime()
                                        renderGifById.mutate({ 
                                            "HQ": true,
                                            "animated_sequence": true,
                                            "render_format": "gif",
                                            "uids": [ gifData.uid ], 
                                            "text":[text],
                                        })      
                                    // } 
                                    // else{
                                    //     if(isAvailable && rateAppStatus.data[0].show_popup===1 && !freeGifAccess)
                                    //         requestReview() 
                                    //     else
                                    //         StoreIndividualGif()
                                    // }
                                }
                            } }
                            style={{alignSelf:'center', margin:20 }} >
                            <ShareIcon width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Activity Indicator */}
                    <View style={{paddingVertical:20}} >
                        {
                            downloading ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Downloading...</Text>
                            : sharing ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Sharing...</Text>
                            : copying ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Copying...</Text>
                            : null
                        }
                    </View>

                    {/* Text Ipnut */}
                    <View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
                        <TextInput
                            editable={true}
                            placeholderTextColor={'#25282D'}
                            showSoftInputOnFocus={true}
                            onSubmitEditing={() => { }}
                            onChangeText={(e: any) => { setText(e);  setTextCheck(true) }}
                            placeholder={'Your text here'}
                            value={ text }
                            style= {{ 
                            fontSize: RFValue(15),
                            fontFamily:'arial',
                            width:'75%',
                            alignSelf:'center',
                            height: RFValue(40), 
                            marginLeft: RFValue(20),
                            color:'#000000',
                            }}            
                        />
                        
                        <TouchableOpacity 
                            onPress={()=> { 
                                Keyboard.dismiss()
                                if(!gifData.giphy)
                                    {
                                        setLoader(true); 
                                        renderGifById.mutate({ 
                                        text:[text],
                                        "HQ": true,
                                        "animated_sequence": true,
                                        "render_format": "webp",
                                        "uids": [ gifData.uid ], 
                                    }) 
                                }
                        }} >
                            <View style={{padding:15}} >
                                {loader ?
                                    <ActivityIndicator size={'small'} />
                                    :
                                    <RightTick width={RFValue(20)} height={RFValue(20)} />
                                }
                            </View>
                        </TouchableOpacity>
                        
                    </View> 
                </ScrollView>
            </KeyboardAvoidingView>}
        </SafeAreaView>
    )
}

export default IndividualGiphScreen

