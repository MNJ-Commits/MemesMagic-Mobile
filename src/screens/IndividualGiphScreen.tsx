import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import Refresh from "../assets/svgs/refresh.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import BackButton from "../assets/svgs/back-button.svg";
import RightTick from "../assets/svgs/right-tick.svg";


const IndividualGiphScreen = ({navigation, route}:any)=> {    
    
    const [text, setText] = useState<string>('')
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

      const RenderGifByID = async (text: string[])=>{
        
        let data = {
          method: 'POST',
          body: JSON.stringify({ "text": text, "uids": [ route.params.uid ] }),
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }
        const response = await fetch('http://18.143.157.105:3000/renderer/render', data)    
        await response?.json()
        ?.then(e => { 
          console.log(e?.data[0]?.render);
           
          setGIF(e?.data[0]?.render)
        })
        .catch((error: any)=>{  console.log('render: ', error) })
      }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#25282D' }} >
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding': undefined }
                keyboardVerticalOffset={20}
            >
                <View style={{flex:1, justifyContent:'center' }} >
                    <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{margin:20 }} >
                        <BackButton width={RFValue(25)} height={RFValue(25)}/>
                    </TouchableOpacity>
                
                    <Image
                        source={{uri: gif ? `http://18.143.157.105:3000${gif}` : route.params.src}}
                        style={[{width: '100%', aspectRatio: route.params.width/route.params.height, resizeMode:'contain' } ]}
                    />
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
                        <TouchableOpacity onPress={()=> { RenderGifByID([`${text}`]) }} >
                            <RightTick width={RFValue(20)} height={RFValue(20)} />
                        </TouchableOpacity>
                    </View> 
                    
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default IndividualGiphScreen