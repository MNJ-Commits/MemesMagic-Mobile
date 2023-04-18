import React, { useEffect, useState } from "react";
import { Animated, Button, Easing, View } from "react-native"
import { RFValue } from "react-native-responsive-fontsize";
import Refresh from "../assets/svgs/refresh.svg";


const ActivityIndicator = ()=>{

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

return( 
    // <View style={{ flex:1, alignItems:'center', justifyContent:'center'  }} >
        <Animated.View style={{transform: [
            {rotate: rotation},
            { translateX: -13},
            { translateY: -2.5},
            ]
        }} >
            <Refresh width={RFValue(20)} height={RFValue(20)} style={{marginLeft:RFValue(25), marginTop:RFValue(5)}} />
        </Animated.View>
    // </View>

           
      {/* {loader &&
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center' }} >
          <Text style={{color:'#7C7E81', fontSize:RFValue(12), marginTop:RFValue(3), fontWeight:'normal' }} >Pull down to refresh</Text>
          <ActivityIndicator />
        </View>
        } */}
)}

export default ActivityIndicator