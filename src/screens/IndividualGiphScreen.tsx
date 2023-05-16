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
import { loadAppleAccessTokenFromStorage, loadVerifyPaymentFromStorage } from '../store/asyncStorage';
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

    const returnScreen = route.params?.returnScreen
    // console.log('returnScreen: ',returnScreen);
    // console.log('route.params: ',route.params);
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
        if(route?.params?.giphy){
            const textSting = route.params?.src2?.split("&w")[0]
            setText(textSting?.split("=")[1])
        }
        else{
            // For custom download
            renderRenderById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "gif",
                "uids": [ route.params.uid ], 
                text:[route.params?.defaultText],
            }) 
            // For custom render 
            renderRenderById.mutate({ 
                "HQ": true,
                "animated_sequence": true,
                "render_format": "webp",
                "uids": [ route.params.uid ],
                text:[route.params?.defaultText]
            })
            setText(route.params.defaultText)
        }
    },[])

    const textSting = route.params?.src2?.split("&w")[1] 
    
    let BannerURI: string = ''
    text ? BannerURI+=`?text=${text}&w`+textSting : route.params?.src2

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

    const DownloadCustomGif  = async ()=>{

        setDownloading(true)
        //Define path and directory to store files to
        const filePath = RNFS.DocumentDirectoryPath + `/${datetime}.gif`
        console.log('fromURL: ',fromURL);

        // // TO SAVE GIF'S TO IOS PHOTO 
        // await CameraRoll.save(fromURL, { type: 'video', album:'MemeMagic' }).then((res:any)=>{
        //     console.log('res: ', res);
        // }).catch((error:any)=>{
        //     console.log('error: ', error);
        // })

        // TO SAVE GIF'S TO IOS LIBRARY
        //Define options
        const options: DownloadFileOptions = {
            fromUrl: fromURL,
            toFile: filePath,
            headers: { 'Accept': 'application/json',  'Content-Type': 'application/json',  "X-ACCESS-TOKEN": appleAccessToken }
        } 
        let response = await downloadFile(options);
        return response.promise.then(async (res: any) => {
            setDownloading(false)
            console.log('res: ', res, filePath);               
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
            "giphy_url":  route.params?.src
        }
        await RNFetchBlob.fetch('POST', 'http://18.143.157.105:3000/giphy/render',
            { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": appleAccessToken }, 
            JSON.stringify({...payload }))
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
                            // // TO SAVE GIF'S TO IOS PHOTO 
                            // await CameraRoll.save(filePath, { type: 'video', album:'MemeMagic' })
                            // .then((res:any)=>{
                            //     console.log('res: ', res);
                            // }).catch((error:any)=>{
                            //     console.log('error: ', error);
                            // })
                        })
                        
                    }
                })
                .catch((error:any)=>{ console.log('fetch error: ', error) });

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
            .fetch('GET', fromURL, 
            { 'Content-Type': 'application/json', "X-ACCESS-TOKEN": appleAccessToken }, )
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
            "giphy_url":  route.params?.src
        }

        // console.log(payload);
        

        let data: any;
        await RNFetchBlob.fetch('POST', 'http://18.143.157.105:3000/giphy/render',
            { 'Content-Type': 'application/json', 
            "X-ACCESS-TOKEN": appleAccessToken,  
        }, JSON.stringify({...payload }) )
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

    const getter = async () => {
    
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
    
    // console.log('verifyPayment: ', verifyPayment);
    // console.log('appleAccessToken: ', appleAccessToken);
    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#25282D' }}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding': undefined }
                keyboardVerticalOffset={20}
            >
                {/* Back Button */}
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                    // navigation.navigate(returnScreen, {text:text})
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
                        source={{uri: route.params?.giphy ? route.params.src : webp }}
                        style={[{width: '100%', aspectRatio: route.params.width/route.params.height, resizeMode:'contain', borderRadius:RFValue(30), margin:RFValue(20),  } ]}
                    />        
                    {
                    route.params.giphy && 
                        <Image 
                            source={{uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                                    headers:{ "X-ACCESS-TOKEN": appleAccessToken }
                                }}
                            resizeMode={'contain'}
                            style={{
                                width:'100%', 
                                aspectRatio: route.params.width/route.params.height,
                                position:'absolute',
                                borderRadius:RFValue(30), margin:RFValue(20),
                            }}
                        />
                    }

                    
                    {/* Download/Share */}
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center' }} >
                        <TouchableOpacity 
                            disabled = { !route.params.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                // if (verifyPayment?.subcription){
                                //     route.params?.giphy ? ShareGiphyGif() : ShareCustomGif()
                                // } else{
                                //     navigation.navigate('SubcriptionScreen', route.params?.giphy ? {returnScreen : 'BannerScreen'}: {returnScreen : 'CustomScreen'})
                                // }
                            }}
                            style={{alignSelf:'center', margin:20 }} >
                            <CopyIcon width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled = { !route.params.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                    if (verifyPayment?.subcription){
                                        route.params?.giphy ? DownloadGiphy() : DownloadCustomGif()
                                    } else{
                                        navigation.navigate('SubcriptionScreen', route.params?.giphy ? {returnScreen : 'BannerScreen'}: {returnScreen : 'CustomScreen'})
                                    }}}
                            style={{alignSelf:'center', margin:20 }} >
                            <DownloadSvg width={RFValue(40)} height={RFValue(40)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled = { !route.params.giphy && !fromURL ? true : false}
                            onPress={ ()=>{
                                if (verifyPayment?.subcription){
                                    route.params?.giphy ? ShareGiphyGif() : ShareCustomGif()
                                } else{
                                    navigation.navigate('SubcriptionScreen', route.params?.giphy ? {returnScreen : 'BannerScreen'}: {returnScreen : 'CustomScreen'})
                                    // route.params?.giphy && text ?
                                    //     navigation.navigate( 'SubcriptionScreen',{src: route.params.src, width: route.params.width, height: route.params.height, giphy: route?.params?.giphy, src2: route.params?.src2, returnScreen: 'IndividualGiphScreen' })
                                    // : route.params?.defaultText ? 
                                    //     navigation.navigate( 'SubcriptionScreen',{src:route.params.src, width: route.params.width, height: route.params.height, uid: route.params.uid, defaultText: route.params?.defaultText, returnScreen: 'IndividualGiphScreen' }) 
                                    // : null
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
                            : !route.params.giphy && !fromURL ?
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
                            if(!route.params.giphy){
                                setLoader(true); 
                                Keyboard.dismiss()
                                renderRenderById.mutate({ 
                                    text:[text],
                                    "HQ": true,
                                    "animated_sequence": true,
                                    "uids": [ route.params.uid ], 
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default IndividualGiphScreen