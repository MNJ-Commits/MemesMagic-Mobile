import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, RefreshControl, Image, Keyboard, Linking, Alert, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Download2 from "../assets/svgs/download2.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import AppFlatlist from '../components/AppFlatlist';
import { useGetCustomTemplates } from '../hooks/useGetCustomTemplates';
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';

const CustomScreen = ({navigation, route}:any) => {
 
  const [allGif, setAllGIF] = useState<any>([])
  const [UIDs, setUIDs] = useState<any>([])
  const [text, setText] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [loader, setLoader] = useState<Boolean>(true)

  const getCustomTemplates: any = useGetCustomTemplates(tag,{
    onSuccess: (res: any) => {
      // console.log('res: ', res);      
      setLoader(false)
      setAllGIF(res) 
      const uids = res?.map((items: any) => {
        return  items.uid
      });
      setUIDs(uids)
    },
    onError: (res: any) => console.log('onError: ',res),
  });
  
  const getCustomRenders: any = usePostCustomRenders({
    onSuccess(res) { 
      // console.log('res: ', res);
      setAllGIF(res) 
      setLoader(false)
    },
    onError(error) {
      console.log('getCustomRenders error: ', error);
    },
  });  

  const refresh = () => {
    setLoader(true)
    setAllGIF([]);    
    if(text.length!=0){
      getCustomRenders.mutate({ text:[text], "uids": UIDs})
    }
    else{
      getCustomTemplates.refetch()
    }
  };
  
  useEffect(()=>{
    setLoader(false)
    setText('')
  },[])  

  useEffect(()=>{
    getCustomTemplates.refetch()
  },[tag])  


  return (
    <SafeAreaView style= {{flex:1, backgroundColor:'#25282D' }} >
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding': undefined }
        keyboardVerticalOffset={10}
      >
        {/* Header */}
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',  backgroundColor:'#000000', padding:15 }}>
          <View style={{flexDirection:'row', width:'48%', justifyContent:'space-around'}} >
            <TouchableOpacity onPress={() => navigation.navigate('CustomScreen')} style={{ backgroundColor:'#3386FF', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10) }} >
              <Text style={{color:'white', fontSize:RFValue(8), marginTop:RFValue(2), fontFamily:'Lucita-Regular'}} >CUSTOM</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('BannerScreen')}  style={{ backgroundColor:'#A8A9AB', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10) }} >
              <Text style={{color:'white', fontSize:RFValue(8), marginTop:RFValue(2), fontFamily:'Lucita-Regular' }} >BANNER</Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection:'row', width:'30%', justifyContent:'space-around'}} >
            <TouchableOpacity>
              <Suggestions width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Download2 width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate('SubscriptionScreen',{returnScreen:'CustomScreen'})}} >
              <Pro width={RFValue(25)} height={RFValue(25)}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Menu */}
        <View style={{ backgroundColor:'#FF439E', padding:RFValue(10), }}>
          {
            visibleSearch ?          
            <View style={{flexDirection:'row', alignItems:'center', width:'100%', alignSelf:'center', }}>     
              <View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center', width:'80%', borderRadius:RFValue(30), backgroundColor: '#FF439E', borderWidth:1, borderColor:'#ffffff', height:RFValue(35.5)  }} >
                <Search width={RFValue(20)} height={RFValue(20)} style={{ marginHorizontal: RFValue(10),}} />
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
                    fontSize: RFValue(15),
                    fontFamily:'arial',
                    width:'85%',
                    alignSelf:'center',
                    height: RFValue(40), 
                    color:'#ffffff',
                  }}            
                />
              </View> 
              <TouchableOpacity onPress={()=> { setVisibleSearch(false); setTag('') }} >
                <Text style={{ fontFamily:'Lucita-Regular', color:'#ffffff', fontSize: RFValue(14), paddingLeft:RFValue(10) }}>Cancel</Text>
              </TouchableOpacity>
            </View> 
              :
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}} >
                <TouchableOpacity onPress={()=>setVisibleSearch(true)} style={{borderWidth:1, borderColor:"#ffffff", width:RFValue(35), height:RFValue(35), padding:RFValue(6), borderRadius:RFValue(20), marginRight:RFValue(10) }}  >
                  <Search width={RFValue(20)} height={RFValue(20)} />
                </TouchableOpacity> 
                <ScrollView 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#FF439E' }} >
                {
                  // ['Random', 'TV', 'Movies', 'Sports', 'Screens']
                  ["Crowd", "Banner", "Stage", "Cardboard", "Surprised", "Ironman", "Painting", "Tony Stark", "Car", "Road", "Crash", "Board", "Siblings", "Pencil", "Table", "The Office", "Rock", "call", "Notice Board", "Sticky Note", "Check", "Nurse", "Laser", "Road Sign"].map((data:string, index: number)=>{
                  return(
                      <TouchableOpacity 
                        onPress={()=>{ 
                          if(data==tag){setTag('')} 
                          else{ setTag(data); setLoader(true);} }} 
                          key={index} 
                          style={[{ flexDirection:'row', alignItems:'center', justifyContent:'center', width:RFValue(80), height:RFValue(35), borderRadius: RFValue(20), marginRight:RFValue(15), borderWidth:1 }, tag==data ? { backgroundColor:'#F9C623', borderColor:'#F9C623'} : { backgroundColor:'#FF439E', borderColor:'#ffffff'} ]} >
                        <Text style={[tag==data ? {color:'#24282C',} : { color:'#ffffff'}, { fontSize:RFValue(11), paddingTop:RFValue(8), paddingBottom:RFValue(5), fontFamily:'Lucita-Regular', }]} >{data}</Text>
                      </TouchableOpacity>
                    )})
                  }
                </ScrollView>
              </View>
          }
        </View>

        {/* Grid View */}
          <AppFlatlist 
            data={allGif ? allGif : []}
            giphy={false}
            refresh = {refresh}
            isLoader={loader}
            response = {getCustomTemplates}
            renderData = {getCustomRenders.data}
            text={text}
            navigation={navigation}
          />
          
        {/* Text Ipnut */}
        <View style={{ marginTop:RFValue(5), flexDirection:'row', alignItems:'center',  alignSelf:'center',  width:'90%', borderRadius:RFValue(30), backgroundColor: '#ffffff', height:RFValue(40)  }} >
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
              Keyboard.dismiss()
              refresh()
            }}
          >
           {loader ?
            <ActivityIndicator size={'small'} />
            :
            <RightTick width={RFValue(20)} height={RFValue(20)} />
          }
          </TouchableOpacity>
        </View> 
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomScreen;


