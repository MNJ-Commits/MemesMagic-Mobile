import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, } from 'react-native';
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
import { useGetFonts } from '../hooks/useGetFonts';
import { AppModal } from '../components/AppModal';
import {Colors} from '../utils/colors'


const BannerScreen = ({navigation}:any) => {
 
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [sText, setSText] = useState<Boolean>(false)
  const [fontFamily, setFontFamily] = useState<string>('')  
  const [fontcolor, setFontcolor] = useState<string>('')  
  const [textPosition, setTextPosition] = useState('bottom')
  const [fontsArray, setFontsArray] = useState<string[]>([])  
  const [text, setText] = useState<string>('')
  const [loader, setLoader] = useState<Boolean>(false)
  const [isFontModalVisible, setFontModalVisible] = useState(false);
  const [isColorModalVisible, setColorModalVisible] = useState(false);
  const [allGif, setAllGIF] = useState<any>([])  

  const getBannerTemplates: any = useGetBannerTemplates({
    onSuccess: (res: any) => {
      setAllGIF(res) 
      setLoader(false)
    },
    onError: (res: any) => console.log('onError: ',res),
  });
  const getFonts: any = useGetFonts({
    onSuccess: (res: any) => {
      setFontsArray(res);
    },
    onError: (res: any) => console.log('onError: ',res),
  });

  const refresh = () => {
    setAllGIF([]); 
    setLoader(true)   
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
          <View style={{flexDirection:'row', alignItems:'center', width:'100%', alignSelf:'center', }}>     
            <View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center', width:'80%', borderRadius:RFValue(30), backgroundColor: '#FF439E', borderWidth:1, borderColor:'#ffffff', height:RFValue(35.5)  }} >
              {/* <TouchableOpacity onPress={()=> { setVisibleSearch(false) }} > */}
                <Search width={RFValue(20)} height={RFValue(20)} style={{ marginHorizontal: RFValue(10),}} />
              {/* </TouchableOpacity> */}
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
                  color:'#000000',
                }}            
              />
            </View> 
            <TouchableOpacity onPress={()=> { setVisibleSearch(false) }} >
              <Text style={{fontFamily:'arial', fontWeight:'bold', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', }}>
            <TouchableOpacity onPress={()=>setVisibleSearch(true)} style={{borderWidth:1, borderColor:"#ffffff", width:RFValue(35), height:RFValue(35), padding:RFValue(6), borderRadius:RFValue(20), marginRight:RFValue(10) }}  >
              <Search width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity> 
            <View style={{ flexDirection:'row', justifyContent:'space-between', width:'85%', paddingHorizontal:RFValue(15), alignItems:'center', backgroundColor:'#ffffff', borderRadius: RFValue(20), padding:RFValue(5)   }} >
              <TouchableOpacity onPress={()=>{setFontModalVisible(!isFontModalVisible)}} >
                <TextIcon width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{setColorModalVisible(!isColorModalVisible)}} >
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

        {/* GridView */}
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
          color = {fontcolor} 
          font = {fontFamily}
        />

        {/* Apply Text */}
        <View 
          style={{ 
          marginTop:RFValue(5), flexDirection:'row', alignItems:'center',alignSelf:'center',width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
          <TextInput
            editable={true}
            multiline={true}
            placeholderTextColor={'#25282D'}
            onChangeText={(e: any) => { setText(e) }}
            placeholder={'Type your text here'}
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
            {loader ?
              <ActivityIndicator size={'small'} />
              :
              <RightTick width={RFValue(20)} height={RFValue(20)} />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Font Family Modal */}
      <AppModal isVisible={isFontModalVisible} setModalVisible = {setFontModalVisible} >
        <AppModal.Container>
          <AppModal.Header title="Select a font style" />
          <AppModal.Body>
            <ScrollView 
              style={{padding:RFValue(10), height: RFValue(200)}} showsVerticalScrollIndicator={false} >
              {/* <Text style={[{fontFamily:'arial', fontSize: RFValue(16), color:'#ffffff', fontWeight:'bold'} ]}>{fontFamily.split('.')[0]}</Text>               */}
              {fontsArray.map((data:any)=>{  
                return(
                  <TouchableOpacity 
                    onPress={()=> 
                      {
                        setFontFamily(data.font)
                        setTimeout(()=>setFontModalVisible(false), 500)
                      }}
                    style={{padding:10}} >
                    {/* <Text style={[{fontFamily:'arial', fontSize: RFValue(14), color:'#ffffff'}]}>{data.fontname}</Text> */}
                    <Text style={[{fontFamily:'arial', fontSize: RFValue(14), color:'#ffffff'}, fontFamily.split('.')[0] == data.fontname.toLowerCase() && {fontWeight:'bold', fontSize: RFValue(16) } ]}>{data.fontname}</Text>
                  </TouchableOpacity>
                )}
              )}
            </ScrollView>
          </AppModal.Body>
          <AppModal.Footer>
          </AppModal.Footer>
        </AppModal.Container>
      </AppModal>
      
      {/* Color Modal */}
      <AppModal isVisible={isColorModalVisible} setModalVisible = {setColorModalVisible} >
        <AppModal.Container>
          <AppModal.Header title="Select a font color" />
          <AppModal.Body>
            <ScrollView 
              style={{padding:RFValue(10), height: RFValue(200)}} showsVerticalScrollIndicator={false} >
              {/* <Text style={[{fontFamily:'arial', fontSize: RFValue(16), color:'#ffffff', fontWeight:'bold'} ]}>{fontFamily.split('.')[0]}</Text>               */}
              {Colors.map((data:any)=>{  
                return(
                  <TouchableOpacity 
                    onPress={()=> 
                      {
                        setFontcolor(data.hex)
                        setTimeout(()=>setColorModalVisible(false), 500)
                      }}
                    style={{flexDirection:"row", justifyContent:"space-between", alignItems:'center', padding:10, }} >
                    {/* <Text style={[{fontFamily:'arial', fontSize: RFValue(14), color:'#ffffff'}]}>{data.fontname}</Text> */}
                    <Text style={[{fontFamily:'arial', fontSize: RFValue(14), color:'#ffffff'}, fontcolor == data.hex && {fontWeight:'bold', fontSize: RFValue(16) } ]}>{data.colorName }</Text>
                    <View style={{width:RFValue(15), height:RFValue(15), backgroundColor: data.hex }} ></View>
                  </TouchableOpacity>
                )}
              )}
            </ScrollView>
          </AppModal.Body>
          <AppModal.Footer>
          </AppModal.Footer>
        </AppModal.Container>
      </AppModal>

    </SafeAreaView>
  );
};


export default BannerScreen;



