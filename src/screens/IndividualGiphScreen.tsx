import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Refresh from "../assets/svgs/refresh.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from "../assets/svgs/back-button.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import ShareIcon from "../assets/svgs/shareIcon.svg";
import DownloadSvg from "../assets/svgs/download.svg";
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';
// import Video from 'react-native-video';


import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

import { DownloadFileOptions, downloadFile } from 'react-native-fs';
import { checkLibraryPermissions, requestLocationPermissions } from '../utils/Permissions';
var RNFS = require('react-native-fs');


const IndividualGiphScreen = ({navigation, route}:any)=> {    
    
    const [text, setText] = useState<string>('')
    const [loader, setLoader] = useState<Boolean>(false)
    const [downloading, setDownloading] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const [webp, setWebp] = useState<string>('')
    const [gif, setGif] = useState<string>('')

    // console.log('route.params.src: ',route.params.src);
    // console.log('gif: ',gif);
    
    let animation = new Animated.Value(0);
    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      });
  
      const spinner = ()=>{
        animation.setValue(0)
        Animated.timing(animation, {
            toValue: 1, 
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(()=> spinner());
      }
      useEffect(()=>{
        spinner()
      },[])

    const renderRenderById: any = usePostCustomRenders({
        onSuccess(res) { 
            if(res[0].render.includes('.gif')){
                setGif(`http://18.143.157.105:3000${res[0].render}`) 
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

        renderRenderById.mutate({ 
            "HQ": true,
            "animated_sequence": true,
            "render_format": "gif",
            "uids": [ route.params.uid ], 
            text:[route.params?.defaultText],
        }) 

        renderRenderById.mutate({ 
            "HQ": true,
            "animated_sequence": true,
            "render_format": "webp",
            "uids": [ route.params.uid ],
            text:[route.params?.defaultText]
        })

    },[])

    const textSting = route.params?.src2?.split("&w")[1] 
    
    let BannerURI: string = ''
    text ? BannerURI+=`?text=${text}&w`+textSting : route.params?.src2

    
    // Directorys available for both libraries
    // console.log(RNFetchBlob.fs.dirs);
    // console.log(RNFS);
    

    // checkLibraryPermissions( ).then((resp:any)=>{
    //     // console.log('resp: ',resp);
    //     if(!resp){
    //         requestLocationPermissions()
    //     }
    // }).catch((error:any)=>{
    //     console.log('error resp: ', error);
    // })

    var today = ""+new Date()
    const datetime = today.split('GMT')[0].replace(/\:/g, '.').trim().replace(/\ /g, '_')

    // Download Files
    const Download = async ()=>{

        setDownloading(true)
        //Define URl to Download from
        // let fromURL = webp ? webp : route.params.src
        let fromURL = gif
        console.log('fromURL: ', fromURL);

        // TO SAVE TO IOS PHOTO
        await CameraRoll.save(fromURL, { type: 'video', album:'MemeMagic' }).then((res:any)=>{
            console.log('res: ', res);
        }).catch((error:any)=>{
            console.log('error: ', error);
        })

        //Define dirctory to store file to 
        const dirPath = RNFS.DocumentDirectoryPath
        //Define path to store file along with the extension
        const filePath = dirPath + `/${datetime}.gif`
        //Define options
        const options: DownloadFileOptions = {
            fromUrl: fromURL,
            toFile: filePath,
            headers: { 'Accept': 'application/json',  'Content-Type': 'application/json' }
        }

        // // IOS creates a default sub-directory
        // RNFS.exists(dirPath+"MemeMagic")
        // .then((result:any) => {
        //     if(!result)
        //     {   
        //         console.log("Directory doesn't exists: ", result);    
        //         RNFS.mkdir(dirPath)
        //         .then((result:any) => {
        //             console.log("Directory Created: ", result);    
        //         }) 
        //     }
        // })

        // TO SAVE TO IOS FILES
        const response = await downloadFile(options);
        return response.promise.then(async res => {
            setDownloading(false)
            console.log('res: ', res, filePath);               
        }).catch((error:any)=>{
            setDownloading(false)
            console.log('error: ', error);
        })
    }

    // 1. Cache Download,   2. Share,   3. Remove
    const share = () => {

        setLoading(true)
        
        let fileUrl = gif;
        let filePath: any;
        let data: any;
        const configOptions = {
          fileCache: true,
          path: RNFetchBlob.fs.dirs.LibraryDir + `/${datetime}.gif`,
        };

        // Download,
        RNFetchBlob.config(configOptions)
          .fetch('GET', fileUrl)
          .then(async (resp:any) => {
            setLoading(false)
            filePath = await resp.path();
            data = await resp.base64();            
            return data
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
              console.log('error: ', error);
          });
  
          // Alternate to react-native-share i-e preview to Download or Share
          // RNFetchBlob.ios.previewDocument(filePath);  
          
          // Remove from device's storage
          RNFetchBlob.fs.unlink(filePath);
        })
        
        .catch((error:any)=>{
            setLoading(false)
            console.log("error: ",error);
        })
        ;
    }

    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#25282D' }} >
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding': undefined }
                keyboardVerticalOffset={20}
            >
                <ScrollView 
                    style={{flex:1}} 
                    contentContainerStyle={{ justifyContent:'center' }}
                 >
                    {/* Back Button */}
                    <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{margin:20 }} >
                        <BackButton width={RFValue(25)} height={RFValue(25)}/>
                    </TouchableOpacity>
                
                    {/* Gif */}
                    <Image
                        source={{uri: route.params.giphy ? route.params.src : webp }}
                        style={[{width: '100%', aspectRatio: route.params.width/route.params.height, resizeMode:'contain' } ]}
                    />        
                    {
                    route.params.giphy && 
                        <Image 
                            source={{uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`}}
                            resizeMode={'contain'}
                            style={{
                                width:'100%', 
                                aspectRatio: route.params.width/route.params.height,
                                position:'absolute',
                                borderRadius:RFValue(10),
                            }}
                        />
                    }

                    {/* Loader */}
                    {/* <View style={{ alignSelf:'center', position:'absolute', zIndex:-1,  }} >
                        <Animated.View style={{transform: [
                            {rotate: rotation},
                            { translateX: -15},
                            { translateY: -4},
                            ]
                        }} >
                            <Refresh width={RFValue(20)} height={RFValue(20)} style={{marginLeft:RFValue(25), marginTop:RFValue(5)}} />
                        </Animated.View>
                    </View> */}

                    {/* Text Ipnut */}
                    <View style={{ marginTop:RFValue(20), flexDirection:'row', alignItems:'center', alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
                        <TextInput
                            editable={true}
                            placeholderTextColor={'#25282D'}
                            showSoftInputOnFocus={true}
                            onSubmitEditing={() => { }}
                            onChangeText={(e: any) => { setText(e) }}
                            placeholder={'Your text here'}
                            defaultValue={ text ? text : route.params?.defaultText}
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
                    
                    {/* Download/Share */}
                    {!route.params.giphy && 
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center' }} >
                        <TouchableOpacity 
                            disabled = {gif=='' ? true : false}
                            onPress={ Download }
                            style={{alignSelf:'center', margin:20 }} >
                            <DownloadSvg width={RFValue(20)} height={RFValue(20)} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled = {gif==''  ? true : false}
                            onPress={share}
                            style={{alignSelf:'center', margin:20 }} >
                            <ShareIcon width={RFValue(20)} height={RFValue(20)} />
                        </TouchableOpacity>
                    </View>}
                    <View style={{marginTop:20}} >
                        {
                            downloading ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Downloading...</Text>
                            : loading ?
                                <Text style={{alignSelf:'center', fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Loading...</Text>
                            : !route.params.giphy && !gif ?
                                <ActivityIndicator size={'small'} />
                            : null
                        }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default IndividualGiphScreen