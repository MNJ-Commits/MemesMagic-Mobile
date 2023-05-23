import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from "../assets/svgs/back-button.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import ShareIcon from "../assets/svgs/shareIcon.svg";
import CopyIcon from "../assets/svgs/copy.svg";
import DownloadSvg from "../assets/svgs/download.svg";
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';


import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import { DownloadFileOptions, downloadFile, writeFile } from 'react-native-fs';
import { checkLibraryPermissions, requestLibraryPermissions } from '../utils/Permissions';
import { loadAppleAccessTokenFromStorage, loadIndividualGifData, loadVerifyPaymentFromStorage } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
var RNFS = require('react-native-fs');


const IndividualGiphScreen = ({navigation, route}:any)=> {    
    
    const [text, setText] = useState<string>('')
    const [loader, setLoader] = useState<Boolean>(false)
    const [downloading, setDownloading] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const [webp, setWebp] = useState<string>('')
    const [fromURL, setFromURL] = useState<string>('')
    const [verifyPayment, setVerifyPayment] = useState<any>({})
    const [appleAccessToken, setAppleAccessToken] = useState<string>('')
    const [gifData, setGIFData] = useState<any>({})

    // GET Store
    const getter = async () => {
    
        const gif_state = await loadIndividualGifData().catch((error:any)=>{
            console.log('loadAppleAccessTokenFromStorage Error: ', error);
        })
        setGIFData(gif_state) 

        const paymentStatus = await loadVerifyPaymentFromStorage().catch((error:any)=>{
            console.log('loadVerifyPaymentFromStorage Error: ', error);
        })
        setVerifyPayment(paymentStatus) 
        
        const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
            console.log('loadAppleAccessTokenFromStorage Error: ', error);
        })
        setAppleAccessToken(access_token) 


    }
    useFocusEffect(
        React.useCallback(() => {
            getter().catch((error:any)=>{
            console.log('getter Error: ', error);
            })
            // console.log(authData ? authData : null);
            // console.log('appleAccessToken: ', appleAccessToken);
        }, []),
    );
    

    const returnScreen = gifData?.returnScreen
    // console.log('returnScreen: ',returnScreen);
    // console.log('gifData: ',gifData);
    const renderRenderById: any = usePostCustomRenders({
        onSuccess(res) { 
            if(res[0].render.includes('.gif')){
                setFromURL(`http://18.143.157.105:3000${res[0].render}`) 
            }
            else{
                setWebp(`http://18.143.157.105:3000${res[0].render}`) 
            }
            setLoader(false)
        },
        onError(error) {
            console.log(error);
        },
    }); 

    useEffect(()=>{
        if(gifData?.giphy){
            const textSting = gifData?.src2?.split("&w")[0]
            setText(textSting?.split("=")[1])
        }
        else{
            // For custom download
            renderRenderById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "gif",
                "uids": [ gifData.uid ], 
                text:[gifData?.defaultText],
            }) 
            // For custom render 
            renderRenderById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "webp",
                "uids": [ gifData.uid ],
                text:[gifData?.defaultText]
            })
            setText(gifData.defaultText)
        }
    },[gifData])

    const textSting = gifData?.src2?.split("&w")[1] 
    
    let BannerURI: string = ''
    text ? BannerURI+=`?text=${text}&w`+textSting : gifData?.src2

    // checkLibraryPermissions( ).then((resp:any)=>{
    //     if(!resp){
    //         // console.log('resp: ',resp);
    //         requestLibraryPermissions()
    //     }
    // }).catch((error:any)=>{
    //     console.log('error resp: ', error);
    // })


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

    const DownloadCustomGif  = async ()=>{

        setDownloading(true)
        //Define path and directory to store files to
        const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.gif`
        console.log('fromURL: ',fromURL);

        //Define options
        const options: DownloadFileOptions = {
            fromUrl: fromURL,
            toFile: filePath,
            headers: header
        } 

        let response = await downloadFile(options);
        return response.promise.then(async (res: any) => {
            setDownloading(false)
            console.log('res: ', res, filePath);    

             // TO SAVE GIF'S TO IOS PHOTO 
            await CameraRoll.save(filePath, { type: 'auto', album:'MemeMagic' }).then((res:any)=>{
                console.log('res: ', res);
            }).catch((error:any)=>{
                console.log('error: ', error);
            })
         
        }).catch((error:any)=>{
            setDownloading(false)
            console.log('error: ', error);
        })


    }

    // Download Files
    const DownloadGiphy = async ()=>{

        setDownloading(true)
        //Define path and directory to store files to
        const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.gif`
        const payload = {
                    "banner_url": `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                    "giphy_url":  gifData?.src
                }

        await RNFetchBlob
            .fetch('POST', 'http://18.143.157.105:3000/giphy/render',
                header, JSON.stringify({...payload }))
                .then(async (response) =>{ 

                    if(response.info().status==200){
                        // TO SAVE GIF'S TO IOS LIBRARY                            
                        writeFile(filePath, response.base64(), 'base64')
                        .then((writeFileReposne)=> {
                            console.log('writeFileReposne: ', writeFileReposne);
                            setDownloading(false)
                        }).catch((writeFile:any)=>{
                            console.log('writeFile error: ',writeFile) 
                        })
                        console.log('filePath: ', filePath);
                    
                        RNFS.exists(filePath).then(async (status: any)=>{
                           // TO SAVE GIF'S TO IOS PHOTO 
                            await CameraRoll.save(filePath,).then((res:any)=>{
                                console.log('res: ', res);
                            }).catch((error:any)=>{
                                console.log('error: ', error);
                            })
                        })
                        setDownloading(false)
                    }
                    
                }).catch((writeFile:any)=>{
                    console.log('writeFile error: ',writeFile) 
                })
                console.log('filePath: ', filePath);
                
        }

 

    // 1. Download   2. Share   3. Remove
    const ShareCustomGif = () => {

        setLoading(true)   
        let filePath: any;
        let data: any;
        const configOptions = {
                fileCache: true,
                path: RNFetchBlob.fs.dirs.LibraryDir + `/${datetime}.gif`,
            };
        // Download,
        RNFetchBlob.config(configOptions)
            .fetch('GET', fromURL, header)
            .then(async (resp:any) => {
                setLoading(false)
                filePath = await resp.path();
                data = await resp.base64();            
                return data
            }).then((base64Data:any) => {
                // Share
                let options = {
                    type: 'image/gif',
                    url: `data:image/png;base64,${base64Data}`     // (Platform.OS === 'android' ? 'file://' + filePath)
                    };  
                Share.open(options).then((res:any)=>{
                    console.log('res: ', res);
                }).catch((error:any)=>{
                    setLoading(false)
                    console.log('error: ', error);
                });
                // Remove from device's storage
                RNFetchBlob.fs.unlink(filePath);
            }).catch((error:any)=>{
                setLoading(false)
                console.log("error: ",error);
            })
    }

    // 1. Download   2. Share,
    const ShareGiphyGif=async ()=>{
        
        setLoading(true)   
        const payload = {
            "banner_url": `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
            "giphy_url":  gifData?.src
        }

        let data: any;
        await RNFetchBlob.fetch('POST', 'http://18.143.157.105:3000/giphy/render',
            header, JSON.stringify({...payload }) )
            .then(async (response) =>{ 
                
                console.log('reponse: ', response.info().status);
                if(response.info().status==200){
                    setLoading(false)
                    data = await response.base64() 
                    console.log(data);
                    
                    return data
                }
            }).then((base64Data:any) => {
                let options = {
                    type: 'image/gif',
                    url: `data:image/png;base64,${base64Data}`     // (Platform.OS === 'android' ? 'file://' + filePath)
                };  
                // Share
                Share.open(options).then((res:any)=>{
                    console.log('res: ', res);
                }).catch((error:any)=>{
                    setLoading(false)
                    console.log('Share error: ', error);
                });
            }).catch((error:any)=>{ 
                // console.log('fetch error: ', error) 
            });
    }

    // console.log('gifData: ', gifData);
    // console.log('verifyPayment: ', verifyPayment);
    // console.log('appleAccessToken: ', appleAccessToken);
    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#25282D' }}>
          {gifData.src &&  <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding': undefined }
                keyboardVerticalOffset={20}
            >
                {/* Back Button */}
                <TouchableOpacity onPress={()=>{
                    navigation.pop()
                    // navigation.navigate(returnScreen)
                    }}
                    style={{margin:20 }} >
                    <BackButton width={RFValue(25)} height={RFValue(25)}/>
                </TouchableOpacity>
                <ScrollView 
                    style={{flex:1, }} 
                    contentContainerStyle={{ alignItems:'center', marginHorizontal:RFValue(20) }}
                    keyboardShouldPersistTaps='handled' 
                 >
                    {/* Gif */}
                    <Image
                        source={{uri: gifData?.giphy ? gifData.src : webp }}
                        style={[{width: '100%', aspectRatio: gifData.width/gifData.height, resizeMode:'contain', borderRadius:RFValue(30), margin:RFValue(20),  } ]}
                    />        
                    {
                    gifData.giphy && 
                        <Image 
                            source={appleAccessToken ?
                                {   uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                                    headers:{ "X-ACCESS-TOKEN": appleAccessToken }
                                }
                                :
                                { uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}` }
                            }
                            resizeMode={'contain'}
                            style={{
                                width:'100%', 
                                aspectRatio: gifData.width/gifData.height,
                                position:'absolute',
                                borderRadius:RFValue(30), margin:RFValue(20),
                            }}
                        />
                    }

                    
                    {/* Copy/Download/Share */}
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center' }} >
                        <TouchableOpacity 
                            disabled = { !gifData.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                navigation.push('SubscriptionScreen', {returnScreen : 'IndividualGiphScreen'} )
                                // if (verifyPayment?.subcription){
                                //     gifData?.giphy ? ShareGiphyGif() : ShareCustomGif()
                                // } else{
                                //     navigation.navigate('SubscriptionScreen', gifData?.giphy ? {returnScreen : 'BannerScreen'}: {returnScreen : 'CustomScreen'})
                                // }
                            }}
                            style={{alignSelf:'center', margin:20 }} >
                            <CopyIcon width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled = { !gifData.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                    if (verifyPayment?.subcription){
                                        gifData?.giphy ? DownloadGiphy() : DownloadCustomGif()
                                    } else{
                                        navigation.push('SubscriptionScreen', {returnScreen : 'IndividualGiphScreen'} )
                                    }
                                }}
                            style={{alignSelf:'center', margin:20 }} >
                            <DownloadSvg width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled = { !gifData.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                if (verifyPayment?.subcription){
                                    gifData?.giphy ? ShareGiphyGif() : ShareCustomGif()
                                } else{
                                    navigation.push('SubscriptionScreen', {returnScreen : 'IndividualGiphScreen'} )
                                }
                            }}
                            style={{alignSelf:'center', margin:20 }} >
                            <ShareIcon width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{paddingTop:20}} >
                        {
                            downloading ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Downloading...</Text>
                            : loading ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Loading...</Text>
                            : !gifData.giphy && !fromURL ?
                                <ActivityIndicator size={'small'} />
                            : null
                        }
                    </View>

                    {/* Text Ipnut */}
                    <View style={{ marginTop:RFValue(50), flexDirection:'row', alignItems:'center', alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
                        <TextInput
                            editable={true}
                            placeholderTextColor={'#25282D'}
                            showSoftInputOnFocus={true}
                            onSubmitEditing={() => { }}
                            onChangeText={(e: any) => { setText(e) }}
                            placeholder={'Your text here'}
                            value={ text }
                            style= {{ 
                            fontSize: RFValue(15),
                            fontFamily:'arial',
                            width:'82%',
                            alignSelf:'center',
                            height: RFValue(40), 
                            marginLeft: RFValue(20),
                            color:'#000000',
                            }}            
                        />
                        <TouchableOpacity onPress={()=> { 
                            if(!gifData.giphy){
                                setLoader(true); 
                                Keyboard.dismiss()
                                renderRenderById.mutate({ 
                                    text:[text],
                                    "HQ": true,
                                    "animated_sequence": true,
                                    "uids": [ gifData.uid ], 
                                }) 
                            }
                        }} >
                            {/* <RightTick width={RFValue(20)} height={RFValue(20)} /> */}
                            {loader ?
                                <ActivityIndicator size={'small'} />
                                :
                                <RightTick width={RFValue(20)} height={RFValue(20)} />
                            }
                        </TouchableOpacity>
                    </View> 
                </ScrollView>
            </KeyboardAvoidingView>}
        </SafeAreaView>
    )
}

export default IndividualGiphScreen