import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, RefreshControl, Image, Keyboard, Linking, Alert, useWindowDimensions, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Download2 from "../assets/svgs/download2.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import AppFlatlist from '../iComponents/AppFlatlist';
import { useGetCustomTemplates } from '../hooks/useGetCustomTemplates';
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';
import { RFPercentage } from 'react-native-responsive-fontsize';

const CustomScreen = ({navigation, route}:any) => {
 
  const [allGif, setAllGIF] = useState<any>([])
  const [UIDs, setUIDs] = useState<any>([])
  const [text, setText] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [loader, setLoader] = useState<Boolean>(true)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [ratio, setRatio] = useState<number>(0)
  const { height } = useWindowDimensions()



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
    setAllGIF([]);    
    setLoader(true)
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

  // // if keyboad shown is true then expand style sheet
  // const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // useEffect(() => {
  //    const keyboardDidShowListener = Keyboard.addListener(
  //      'keyboardDidShow',
  //      () => {
  //        setKeyboardVisible(true); // or some other action
  //      }
  //    );
  //    const keyboardDidHideListener = Keyboard.addListener(
  //      'keyboardDidHide',
  //      () => {
  //        setKeyboardVisible(false); // or some other action
  //      }
  //    );
 
  //    return () => {
  //      keyboardDidHideListener.remove();
  //      keyboardDidShowListener.remove();
  //    };
  //  }, []);

  //  console.log('isKeyboardVisible: ', isKeyboardVisible);

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

 console.log('isKeyboardVisible: ', isKeyboardVisible);
 
  return (
    <SafeAreaView 
      onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        setViewHeight(height)
      }}
      style= {{flex:1, backgroundColor:'#25282D' }} >
      <KeyboardAvoidingView
        style={{flex: 1, justifyContent:'space-between' }}
        // behavior={(Platform.OS === 'ios' && isKeyboardVisible) ? 'padding': undefined }
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
          <View style={{ backgroundColor:'#FF439E', padding:RFValue(10*ratio), }}>
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
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}} >
                <TouchableOpacity onPress={()=>setVisibleSearch(true)} style={{borderWidth:1, borderColor:"#ffffff", width:RFValue(35*ratio), height:RFValue(35*ratio), padding:RFValue(6*ratio), borderRadius:RFValue(20), marginRight:RFValue(10*ratio) }}  >
                  <Search width={RFValue(20*ratio)} height={RFValue(20*ratio)} />
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
                          style={[{ flexDirection:'row', alignItems:'center', justifyContent:'center', paddingHorizontal:RFValue(10*ratio), height:RFValue(35*ratio), borderRadius: RFValue(20*ratio), marginRight:RFValue(15*ratio), borderWidth:1*ratio }, tag==data ? { backgroundColor:'#F9C623', borderColor:'#F9C623'} : { backgroundColor:'#FF439E', borderColor:'#ffffff'} ]} >
                        <Text style={[tag==data ? {color:'#24282C',} : { color:'#ffffff'}, { fontSize:RFValue(11*ratio), paddingTop:RFValue(8*ratio), paddingBottom:RFValue(5*ratio), fontFamily:'Lucita-Regular', }]} >{data}</Text>
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
    </SafeAreaView>
  );
};

export default CustomScreen;


