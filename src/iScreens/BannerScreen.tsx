import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Keyboard, useWindowDimensions, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Download2 from "../assets/svgs/download2.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import TextIcon from "../assets/svgs/text.svg";
import YellowBoxB from "../assets/svgs/green-box-b.svg";
import YellowBoxBB from "../assets/svgs/green-box-bb.svg";
import YellowBoxT from "../assets/svgs/green-box-t.svg";
import YellowBoxTB from "../assets/svgs/green-box-tb.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import AppFlatlist from '../iComponents/AppFlatlist';
import { useGetBannerTemplates } from '../hooks/useGetBannerTemplates';
import { useGetFonts } from '../hooks/useGetFonts';
import { AppModal } from '../iComponents/AppModal';

import { Colors } from '../utils/colors';


const BannerScreen = ({navigation}:any) => {
 
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [sText, setSText] = useState<Boolean>(false)
  const [fontFile, setFontFile] = useState<string>("Lucita-Regular.otf")  
  const [fontcolor, setFontcolor] = useState<string>("#000000")  
  const [textPosition, setTextPosition] = useState('YellowBoxBB')
  const [fontsArray, setFontsArray] = useState<string[]>([])  
  const [text, setText] = useState<string>("")
  const [loader, setLoader] = useState<Boolean>(true)
  const [isFontModalVisible, setFontModalVisible] = useState(false);
  const [isColorModalVisible, setColorModalVisible] = useState(false);
  const [allGif, setAllGIF] = useState<any>([])  

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [ratio, setRatio] = useState<number>(0)
  const { height } = useWindowDimensions()


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
    {fontname:"Cooper Std", fontFamily:"Cooper Std", fontFile:`${encodeURIComponent("Cooper Std.otf")}`}, 
    {fontname:"Helvetica", fontFamily:"Helvetica", fontFile:"Helvetica.ttc"}, 
    {fontname:"KaushanScript", fontFamily:"KaushanScript-Regular", fontFile:"KaushanScript-Regular.otf"}, 
    {fontname:"Rounds Black", fontFamily:"Rounds Black", fontFile: `${encodeURIComponent("Rounds Black.otf")}`}, 
    // {fontname:"SF Pro Text", fontFamily:"SF-Pro-Text-Regular", fontFile:"SF-Pro-Text-Regular.otf"}, 
  ]

  useEffect(()=>{
    setLoader(false)
  },[])

  useEffect(()=>{
    let denomi = height-(height*0.15)
    setRatio(viewHeight/denomi)
  },[viewHeight])
  
   
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener( 'keyboardDidShow', () => { setKeyboardVisible(true);  });
    const keyboardDidHideListener = Keyboard.addListener( 'keyboardDidHide',  () => { setKeyboardVisible(false);  });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <SafeAreaView 
      onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        setViewHeight(height)
      }}
      style= {{flex:1, backgroundColor:'#25282D' }} >
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios'  ? 'padding': undefined }
        keyboardVerticalOffset={10}
      >
        {/* Header */}
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',  backgroundColor:'#000000', padding:15*ratio }}>
          <View style={{flexDirection:'row', width:`${40*ratio}%`, justifyContent:'space-between'}} >
            <TouchableOpacity onPress={() => navigation.navigate('CustomScreen')} style={{ backgroundColor:'#3386FF', borderRadius: RFValue(20), paddingVertical:RFValue(5*ratio), paddingHorizontal:RFValue(10*ratio) }} >
              <Text style={{color:'white', fontSize:RFValue(8*ratio), marginTop:RFValue(2*ratio), fontFamily:'Lucita-Regular'}} >CUSTOM</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('BannerScreen')}  style={{ backgroundColor:'#A8A9AB', borderRadius: RFValue(20), paddingVertical:RFValue(5*ratio), paddingHorizontal:RFValue(10*ratio) }} >
              <Text style={{color:'white', fontSize:RFValue(8*ratio), marginTop:RFValue(2*ratio), fontFamily:'Lucita-Regular' }} >BANNER</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', width:`${35*ratio}%`, justifyContent:'space-around'}} >
            <TouchableOpacity>
              <Suggestions width={RFValue(25*ratio)} height={RFValue(25*ratio)}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Download2 width={RFValue(25*ratio)} height={RFValue(25*ratio)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              // navigation.navigate('SubscriptionScreen',{returnScreen:'CustomScreen'})
              }} >
              <Pro width={RFValue(25*ratio)} height={RFValue(25*ratio)}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={{flexGrow:1}} >
          {/* Navigation Menu */}      
          <View style={{ backgroundColor:'#FF439E', padding:RFValue(10) }}>
            { 
            visibleSearch ?          
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', width:'100%',  }}>     
              <View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center', width:'80%', borderRadius:RFValue(30), backgroundColor: '#FF439E', borderWidth:1, borderColor:'#ffffff', height:RFValue(35.5*ratio)  }} >
                <Search width={RFValue(20*ratio)} height={RFValue(20*ratio)} style={{ marginHorizontal: RFValue(10*ratio),}} />
                <TextInput
                  editable={true}
                  placeholderTextColor={'#ffffff'}
                  onChangeText={(e: any) => { setTag(e) }}
                  placeholder={'Search'}
                  returnKeyType= {'search'}
                  onSubmitEditing ={ (e)=>{
                      Keyboard.dismiss()
                  }}
                  style= {{ 
                    fontSize: RFValue(15*ratio),
                    fontFamily:'arial',
                    width:'85%',
                    alignSelf:'center',
                    height: RFValue(40*ratio), 
                    color:'#ffffff',
                  }}            
                />
              </View> 
              <TouchableOpacity onPress={()=> { setVisibleSearch(false); setTag('') }} >
                <Text style={{ fontFamily:'Lucita-Regular', color:'#ffffff', fontSize: RFValue(14*ratio), paddingLeft:RFValue(10*ratio) }}>Cancel</Text>
              </TouchableOpacity>
            </View> 
            :
            <View style={{ flexDirection:'row', justifyContent:'space-around',  alignItems:'center', }}>
              <TouchableOpacity onPress={()=>setVisibleSearch(true)} style={{borderWidth:1, borderColor:"#ffffff", width:RFValue(35*ratio), height:RFValue(35*ratio), padding:RFValue(6*ratio), borderRadius:RFValue(20), marginRight:RFValue(10*ratio) }}  >
                <Search width={RFValue(20*ratio)} height={RFValue(20*ratio)} />
              </TouchableOpacity> 
              <View style={{ flexDirection:'row', justifyContent:'space-around', width:'85%', paddingHorizontal:RFValue(15*ratio), alignItems:'center', backgroundColor:'#ffffff', borderRadius: RFValue(20), padding:RFValue(5*ratio)   }} >
                <TouchableOpacity onPress={()=>{setFontModalVisible(!isFontModalVisible)}} >
                  <TextIcon width={RFValue(25*ratio)} height={RFValue(25*ratio)} style={{marginTop:RFValue(6), }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setColorModalVisible(!isColorModalVisible)}} >
                  <View style={{width:RFValue(25*ratio), height:RFValue(22*ratio), backgroundColor: fontcolor, borderColor:'#000000', borderWidth:RFValue(2), borderRadius:RFValue(3), marginRight:RFValue(7) }} ></View>
                  {/* <BgColors width={RFValue(25)} height={RFValue(25)}/> */}
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
                    <YellowBoxB width={RFValue(25*ratio)} height={RFValue(25*ratio)} />
                  </TouchableOpacity>
                : textPosition=='YellowBoxBB' ?  
                  <TouchableOpacity onPress={()=> setTextPosition('YellowBoxT')} >
                    <YellowBoxBB width={RFValue(25*ratio)} height={RFValue(25*ratio)} />
                  </TouchableOpacity>
                : textPosition=='YellowBoxT' ?  
                  <TouchableOpacity onPress={()=> setTextPosition('YellowBoxTB')} >
                    <YellowBoxT width={RFValue(25*ratio)} height={RFValue(25*ratio)} />
                  </TouchableOpacity>
                : textPosition=='YellowBoxTB' ?
                  <TouchableOpacity onPress={()=> setTextPosition('YellowBoxB')} >
                    <YellowBoxTB width={RFValue(25*ratio)} height={RFValue(25*ratio)} />
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
        </View>

        {/* Footer */}
        <View style={{ marginTop:RFValue(5*ratio), flexDirection:'row', alignItems:'center',  alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40*ratio)  }} >
          <TextInput
            editable={true}
            multiline={true}
            placeholderTextColor={'#8d8d8d'}
            onChangeText={(e: any) => { setText(e) }}
            placeholder={'Type your text here'}
            returnKeyType='next'
            style= {{ 
              width:'82%',
              fontSize: RFValue(15*ratio),
              fontFamily:'arial',
              height: RFValue(40*ratio), 
              paddingTop: RFValue(12*ratio),
              marginLeft: RFValue(20),
              color:'#000000',
            }}            
          />
          <TouchableOpacity 
            onPress={()=> { 
              setLoader(true)
              Keyboard.dismiss()
              getCustomRenders.mutate({ 
                text:[text],
                "uids": UIDs,
              })
            }}
          >
            {loader ?
            <ActivityIndicator size={'small'} />
            :
            <RightTick width={RFValue(20*ratio)} height={RFValue(20*ratio)} style={{width:"20%"}} />
          }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Font Family Modal */}
      <AppModal isVisible={isFontModalVisible} setModalVisible = {setFontModalVisible} style={{justifyContent: 'flex-end', margin: 0}}  >
        <AppModal.Container>
          <AppModal.Header title="Select a font style" ratio={ratio} />
          <AppModal.Body ratio={ratio}>
            <ScrollView 
              style={{paddingLeft:RFValue(10*ratio), height: RFValue(300*ratio)}} showsVerticalScrollIndicator={false} >
              {staticFontsPair.map((data:any)=>{  
                return(
                  <TouchableOpacity 
                    onPress={()=> 
                      {
                        setFontFile(data.fontFile)
                        setTimeout(()=>setFontModalVisible(false), 500)
                      }}
                    style={{paddingVertical:10*ratio}} >
                    <Text style={[{fontFamily: data.fontFamily, padding:10*ratio, fontSize: RFValue(16*ratio), color:'#ffffff', }, 
                      fontFile.split('.')[0] === data.fontFile.split('.')[0] && {fontWeight:'bold', fontSize: RFValue(16*ratio), borderWidth:1, borderColor:"#fff"} ]}>
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
      <AppModal isVisible={isColorModalVisible} setModalVisible = {setColorModalVisible} style={{justifyContent: 'flex-end', margin: 0}} >
        <AppModal.Container>
          <AppModal.Header title="Select a font color" ratio={ratio}/>
          <AppModal.Body ratio={ratio}>
             <ScrollView 
              style={{ height: RFValue(300*ratio) }} 
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
                      style={{ width:RFValue(55*ratio), height:RFValue(55*ratio), justifyContent:'center', alignItems:'center'}} >
                    <View style={{width:RFValue(35*ratio), height:RFValue(35*ratio), backgroundColor: data.hex, borderRadius:RFValue(3) }} ></View>
                    <Text style={[{fontFamily:'arial', fontSize: RFValue(8*ratio), padding: RFValue(3*ratio), color:'#ffffff'}]}>{data.hex}</Text>
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



