import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, FlatList, Keyboard, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Downlad from "../assets/svgs/downlad.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import TextIcon from "../assets/svgs/text.svg";
import BgColors from "../assets/svgs/bg-colors.svg";
import STextEnable from "../assets/svgs/s-text-enable.svg";
import STextDisable from "../assets/svgs/s-text-disable.svg";
import YellowBoxB from "../assets/svgs/green-box-b.svg";
import YellowBoxBB from "../assets/svgs/green-box-bb.svg";
import YellowBoxT from "../assets/svgs/green-box-t.svg";
import YellowBoxTB from "../assets/svgs/green-box-tb.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import AppFlatlist from '../components/AppFlatlist';
import { useGetBannerTemplates } from '../hooks/useGetBannerTemplates';
import { useGetFonts } from '../hooks/useGetFonts';
import { AppModal } from '../components/AppModal';

import { Fonts } from '../utils/Fonts';
import { Colors } from '../utils/colors';


const BannerScreen = ({navigation}:any) => {
 
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [sText, setSText] = useState<Boolean>(false)
  const [fontFile, setFontFile] = useState<string>("")  
  const [fontcolor, setFontcolor] = useState<string>("")  
  const [textPosition, setTextPosition] = useState('YellowBoxBB')
  const [fontsArray, setFontsArray] = useState<string[]>([])  
  const [text, setText] = useState<string>("")
  const [loader, setLoader] = useState<Boolean>(true)
  const [isFontModalVisible, setFontModalVisible] = useState(false);
  const [isColorModalVisible, setColorModalVisible] = useState(false);
  const [allGif, setAllGIF] = useState<any>([])  

  const getBannerTemplates: any = useGetBannerTemplates({
    onSuccess: (res: any) => {
      setLoader(false)
      setAllGIF(res) 
    },
    onError: (res: any) => console.log('onError: ',res),
  });

  
  const getFonts: any = useGetFonts({
    onSuccess: (res: any) => {
      // let fontList: {fontname:string; name:string, fontFamily:string}[] = []
      // for (var i=0; i<res.length; i++){
      //   if( staticFonts.includes(res[i].fontname) ) 
      //     fontList.push({'fontname': res[i].fontname, 'name': res[i].name, 'fontFamily':'' })
      // }
      // setFontNameList(fontList)
      setFontsArray(res);
    },
    onError: (res: any) => console.log('onError: ',res),
  });

  const refresh = () => {
    setAllGIF([]); 
    // setText('');
    setLoader(true)   
    getBannerTemplates.refetch()
  };
  
  const staticFontsPair = [
    {fontname:"Arial",              fontFamily:"Arial",             fontFile:"arial.ttf"}, 
    // {fontname:"Arial Black",         fontFamily:"Arial Black",           fontFile:"arialb.ttf"}, 
    {fontname:"Times New Roman",    fontFamily:"times",             fontFile:"times.ttf"}, 
    {fontname:"Bahnschrift",        fontFamily:"Bahnschrift",       fontFile:"bahnschrift.ttf"}, 
    {fontname:"Lucita-Regular",        fontFamily:"Lucita-Regular",       fontFile: "Lucita-Regular.otf"}, 
    // {fontname:"Calibri",            fontFamily:"Calibri Regular",   fontFile:"calibri.ttf"}, 
    {fontname:"Calibr bold",        fontFamily:"Calibri Bold",      fontFile:"calibrib.ttf"}, 
    {fontname:"Calibri bold italic", fontFamily:"Calibri Bold Italic", fontFile:"calibribi.ttf"}, 
    {fontname:"Calibri light",      fontFamily:"Calibri Light",     fontFile:"calibril.ttf"}, 
    {fontname:"Calibri italic",     fontFamily:"Calibri Italic",    fontFile:"calibrii.ttf"}, 
    {fontname:"Calibri light italic", fontFamily:"Calibri Light Italic", fontFile:"calibrili.ttf"}, 
    
    {fontname:"Capture it", fontFamily:"Capture it", fontFile: `${encodeURIComponent("Capture it.ttf")}`}, 
    {fontname:"Cibola", fontFamily:"cibola", fontFile:"cibola.ttf"}, 
    {fontname:"Lazer84", fontFamily:"Lazer84", fontFile:"Lazer84.ttf"}, 
    {fontname:"Netigen", fontFamily:"Netigen", fontFile:"Netigen.ttf"}, 
    {fontname:"Cooper Std", fontFamily:"Cooper Std", fontFile:`${encodeURIComponent("Cooper Std")}`}, 
    {fontname:"Helvetica", fontFamily:"Helvetica", fontFile:"Helvetica"}, 
    {fontname:"KaushanScript", fontFamily:"KaushanScript-Regular", fontFile:"KaushanScript-Regular.otf"}, 
    {fontname:"Rounds Black", fontFamily:"Rounds Black", fontFile: `${encodeURIComponent("Rounds Black.otf")}`}, 
    // {fontname:"SF Pro Text", fontFamily:"SF-Pro-Text-Regular", fontFile:""}, 
  ]



  // console.log('fontsArray: ',fontsArray);

  useEffect(()=>{
    setLoader(false)
  },[])
  
  
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
              {/* <TouchableOpacity onPress={()=>{setSText(!sText)}} >
                {sText ? 
                  <STextEnable width={RFValue(25)} height={RFValue(25)}/>
                  : <STextDisable width={RFValue(25)} height={RFValue(25)}/>
                }
              </TouchableOpacity> */}
              
              { 
              textPosition=='YellowBoxB' ?  
                <TouchableOpacity onPress={()=> setTextPosition('YellowBoxBB')} >
                  <YellowBoxB width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              : textPosition=='YellowBoxBB' ?  
                <TouchableOpacity onPress={()=> setTextPosition('YellowBoxT')} >
                  <YellowBoxBB width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              : textPosition=='YellowBoxT' ?  
                <TouchableOpacity onPress={()=> setTextPosition('YellowBoxTB')} >
                  <YellowBoxT width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              : textPosition=='YellowBoxTB' ?
                <TouchableOpacity onPress={()=> setTextPosition('YellowBoxB')} >
                  <YellowBoxTB width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              : null
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
          textPosition={textPosition==='YellowBoxT' ? 'top' : textPosition==='YellowBoxTB'? 'top' : textPosition==='YellowBoxB' ? 'bottom': 'bottom'}
          textBackground = {(textPosition==='YellowBoxBB' || textPosition==='YellowBoxTB') ? true :false} 
          textStroke={sText}
          color = {fontcolor} 
          font = {fontFile}
        />

        {/* Apply Text */}
        <View 
          style={{ 
          marginTop:RFValue(5), flexDirection:'row', alignItems:'center',alignSelf:'center',width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
          <TextInput
            editable={true}
            multiline={true}
            placeholderTextColor={'#8d8d8d'}
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
          <TouchableOpacity 
            onPress={()=> {
              setLoader(true);
              Keyboard.dismiss()
              getBannerTemplates.refetch()
            }} 
          >
            {loader ?
              <ActivityIndicator size={'small'} />
              :
              <RightTick width={RFValue(20)} height={RFValue(20)} />
            }
            {/* <RightTick width={RFValue(20)} height={RFValue(20)} /> */}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Font Family Modal */}
      <AppModal isVisible={isFontModalVisible} setModalVisible = {setFontModalVisible} >
        <AppModal.Container>
          <AppModal.Header title="Select a font style" />
          <AppModal.Body>
            <ScrollView 
              style={{paddingLeft:RFValue(10), height: RFValue(300)}} showsVerticalScrollIndicator={false} >
              {staticFontsPair.map((data:any)=>{  
                return(
                  <TouchableOpacity 
                    onPress={()=> 
                      {
                        setFontFile(data.fontFile)
                        setTimeout(()=>setFontModalVisible(false), 500)
                      }}
                    style={{paddingVertical:10}} >
                    <Text style={[{fontFamily: data.fontFamily, padding:10, fontSize: RFValue(16), color:'#ffffff', }, 
                      fontFile.split('.')[0] === data.fontFile.split('.')[0] && {fontWeight:'bold', fontSize: RFValue(16), 
                      // borderWidth:1, borderColor:"#fff"
                      } ]}>
                      {data.fontname}
                    </Text>
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
              style={{ height: RFValue(300) }} 
              contentContainerStyle={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center', }}
              showsVerticalScrollIndicator={false} >
              {Colors.map((data:any)=>{  
                return(
                  <TouchableOpacity 
                    onPress={()=> 
                      {
                        setFontcolor(data.hex)
                        setTimeout(()=>setColorModalVisible(false), 500)
                      }}
                      style={{ width:RFValue(55), height:RFValue(55), justifyContent:'center', alignItems:'center'}} >
                    <View style={{width:RFValue(35), height:RFValue(35), backgroundColor: data.hex, borderRadius:3 }} ></View>
                    <Text style={[{fontFamily:'arial', fontSize: RFValue(8), padding: RFValue(3), color:'#ffffff'}]}>{data.hex}</Text>
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



