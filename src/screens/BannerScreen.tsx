import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Downlad from "../assets/svgs/downlad.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import TextIcon from "../assets/svgs/text.svg";
import BgColors from "../assets/svgs/bg-colors.svg";
import STextEnable from "../assets/svgs/s-text-enable.svg";
import STextDisable from "../assets/svgs/s-text-disable.svg";
import GreenBoxB from "../assets/svgs/green-box-b.svg";
import GreenBoxR from "../assets/svgs/green-box-r.svg";
import GreenBoxL from "../assets/svgs/green-box-l.svg";
import GreenBoxT from "../assets/svgs/green-box-t.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import AppFlatlist from '../components/AppFlatlist';
import { useGetBannerTemplates } from '../hooks/useGetBannerTemplates';
 


const BannerScreen = ({navigation}:any) => {
 
  const [allGif, setAllGIF] = useState<any>([])  
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [textPosition, setTextPosition] = useState('bottom')
  const [loader, setLoader] = useState<Boolean>(false)
  const [sText, setSText] = useState<Boolean>(false)

  const getBannerTemplates: any = useGetBannerTemplates({
    onSuccess: (res: any) => {
      setAllGIF(res) 
      setLoader(false)
    },
    onError: (res: any) => console.log('onError: ',res),
  });

  const refresh = () => {
    setAllGIF([]);    
    getBannerTemplates.refetch()
  };
  return (
    <SafeAreaView style= {{flex:1, backgroundColor:'#25282D' }} >
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding': undefined }
        keyboardVerticalOffset={10}
      >
        {/* Header */}
        <View style={{ flexDirection:'row', justifyContent:'space-between', backgroundColor:'#000000',padding:15 }}>
          <View style={{flexDirection:'row', width:'48%', justifyContent:'space-around'}} >
            <TouchableOpacity onPress={() => navigation.navigate('CustomScreen')} style={{ backgroundColor:'#A8A9AB', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10)  }} >
              <Text style={{color:'white', fontSize:RFValue(10), marginTop:RFValue(2), fontWeight:'normal' }} >CUSTOM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor:'#3386FF', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10)  }} >
              <Text style={{color:'white', fontSize:RFValue(10), marginTop:RFValue(2), fontWeight:'normal' }} >BANNER</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', width:'30%', justifyContent:'space-around'}} >
            <TouchableOpacity>
              <Suggestions width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Downlad width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('SubcriptionScreen')}} >
              <Pro width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Menu */}
        
        <View style={{ backgroundColor:'#FF439E', padding:RFValue(10) }}>
          { visibleSearch ?          
          <View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center',  width:'100%', borderRadius:RFValue(30), backgroundColor: '#FF439E', borderWidth:1, borderColor:'#ffffff', height:RFValue(35.5)  }} >
              <TextInput
                editable={true}
                placeholderTextColor={'#ffffff'}
                // onChangeText={(e: any) => { setText(e) }}
                placeholder={'Search'}
                style= {{ 
                  fontSize: RFValue(15),
                  fontFamily:'arial',
                  width:'85%',
                  alignSelf:'center',
                  height: RFValue(40), 
                  marginLeft: RFValue(10),
                  color:'#000000',
                }}            
              />
              <TouchableOpacity onPress={()=> { setVisibleSearch(false) }} >
                <Search width={RFValue(20)} height={RFValue(20)}  />
              </TouchableOpacity>
          </View> 
          :
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', }}>
            <TouchableOpacity onPress={()=>setVisibleSearch(true)} style={{borderWidth:1, borderColor:"#ffffff", width:RFValue(35), height:RFValue(35), padding:RFValue(6), borderRadius:RFValue(20), marginRight:RFValue(10) }}  >
              <Search width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity> 
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:'85%', paddingHorizontal:RFValue(15), alignItems:'center', backgroundColor:'#ffffff', borderRadius: RFValue(20), padding:RFValue(5)   }} >
              <TouchableOpacity>
                <TextIcon width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <BgColors width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setSText(!sText)}} >
                {sText ? 
                  <STextEnable width={RFValue(25)} height={RFValue(25)}/>
                  : <STextDisable width={RFValue(25)} height={RFValue(25)}/>
                }
              </TouchableOpacity>
              
              { 
              textPosition=='top' ?  
                <TouchableOpacity onPress={()=> setTextPosition('bottom')} >
                  <GreenBoxT width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
                : 
                <TouchableOpacity onPress={()=> setTextPosition('top')} >
                  <GreenBoxB width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              }
            
            </View>
          </View>
            }
        </View>

        <AppFlatlist 
          data={allGif}
          giphy={true}
          refresh = {refresh}
          isLoader = {loader}
          response = {getBannerTemplates }
          navigation={navigation}
          text={text}
          textPosition={textPosition}
          textBackground = {sText} 
          // colour = {} 
          // font = {}
          />

        <View 
          style={{ 
          marginTop:RFValue(5), flexDirection:'row', alignItems:'center',alignSelf:'center',width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
          <TextInput
            editable={true}
            multiline={true}
            placeholderTextColor={'#25282D'}
            onChangeText={(e: any) => { setText(e) }}
            placeholder={'Your text here'}
            returnKeyType='next'
            style= {{
              width:'82%',
              fontSize: RFValue(15),
              fontFamily:'arial',
              height: RFValue(40), 
              paddingTop: RFValue(12),
              marginLeft: RFValue(20),
              color:'#000000',  
            }}          
          />
          <TouchableOpacity onPress={()=> {
            setLoader(true);
            getBannerTemplates.refetch()}} 
          >
            <RightTick width={RFValue(20)} height={RFValue(20)} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
};


export default BannerScreen;



