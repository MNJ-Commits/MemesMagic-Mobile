import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Refresh from "../assets/svgs/refresh.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from "../assets/svgs/back-button.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';


const IndividualGiphScreen = ({navigation, route}:any)=> {    
    
    const [text, setText] = useState<string>('')
    const [loader, setLoader] = useState<Boolean>(false)
    const [gif, setGIF] = useState<string>('')

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

    const getCustomRenders: any = usePostCustomRenders({
        onSuccess(res) { 
            setGIF(res[0].render) 
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
    },[])

    const textSting = route.params?.src2?.split("&w")[1] 
    
    let BannerURI: string = ''
    text ? BannerURI+=`?text=${text}&w`+textSting : route.params?.scr2

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
                        source={{uri: gif ? `http://18.143.157.105:3000${gif}` : route.params.src}}
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
                    <View style={{ alignSelf:'center', position:'absolute', zIndex:-1,  }} >
                        <Animated.View style={{transform: [
                            {rotate: rotation},
                            { translateX: -15},
                            { translateY: -4},
                            ]
                        }} >
                            <Refresh width={RFValue(20)} height={RFValue(20)} style={{marginLeft:RFValue(25), marginTop:RFValue(5)}} />
                        </Animated.View>
                    </View>

                    {/* Text Ipnut */}
                    <View style={{ marginTop:RFValue(20), flexDirection:'row', alignItems:'center', alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
                        <TextInput
                            // ref={inputRef}
                            editable={true}
                            placeholderTextColor={'#25282D'}
                            showSoftInputOnFocus={true}
                            // onTouchStart={()=>inputRef.current.focus()}
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
                                getCustomRenders.mutate({ 
                                        text:[`${text}`],
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