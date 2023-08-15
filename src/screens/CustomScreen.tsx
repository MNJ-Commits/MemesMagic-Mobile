import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, Keyboard, Animated, NativeModules, ActivityIndicator, Image, } from 'react-native';
import Suggestions from "../assets/svgs/suggestions.svg";
import Download2 from "../assets/svgs/download2.svg";
import Pro from "../assets/svgs/pro.svg";
import Search from "../assets/svgs/search.svg";
import RightTick from "../assets/svgs/right-tick.svg";
import { RFValue } from 'react-native-responsive-fontsize';
import { useGetCustomTemplates } from '../hooks/useGetCustomTemplates';
import { usePostCustomRenders } from '../hooks/usePostCustomRenders';
import { useFocusEffect } from '@react-navigation/native';
import AppFlatlist  from '../components/AppFlatlist'


const CustomScreen = ({navigation, route}:any) => {
 
  const [allGif, setAllGIF] = useState<any>([])
  const [UIDs, setUIDs] = useState<any>([])
  const [text, setText] = useState<string>('')
  const [tag, setTag] = useState<string>('Random')
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false)
  const [loader, setLoader] = useState<Boolean>(true)   
  const [refreshLoader, setRefreshLoader] = useState<Boolean>(true)  // GIF Loader
  const [showScreen, setShowScreen] = useState<Boolean>(false)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);

  const getCustomTemplates: any = useGetCustomTemplates(tag, page, limit, {
    // enabled:false,
    onSuccess: async (res: any) => {
      // console.log('res: ', res);     
      if(res.length === 0){
        setLoader(false)
      } 
      setAllGIF([...new Set([...allGif, ...res])]);
      setRefreshLoader(false)
      const uids = res?.map((items: any) => {  return  items.uid  });      
      setUIDs([...new Set([...UIDs, ...uids])]);
    },
    onError: (res: any) => console.log('onError: ',res),
  });
  
  const getCustomRenders: any = usePostCustomRenders({
    onSuccess(res) { 
      // console.log('res: ', res);
      // As we render only already loaded templates so there are no duplicates
      setAllGIF((prevAllGIF: any) =>[...prevAllGIF, ...res]);
      setRefreshLoader(false)
    },
    onError(error) {
      console.log('getCustomRenders error: ', error);
    },
  });  
  
  const renderRequestChunk =  ()=>{
  
    setAllGIF([])
    setLoader(true)
    Keyboard.dismiss()
    // getCustomRenders.mutate({ 
    //   text:[text],
    //   "uids": UIDs
    // })
    for (let i = 0; i <= UIDs.length-1; i += 1) {          
      setTimeout(() => {
        getCustomRenders.mutate({ 
          text:[text],
          "uids": [UIDs[i]]
        })
      }, i*200);
    }  
  }

  const refresh = () => {
    console.log('Custom refresh');
    setRefreshLoader(true)
    setLoader(true)
    setLimit(25)
    setAllGIF([]);     
    if (page > 1 && text.length ==0 ) { setPage(1); } 
    else{
      if(text.length!=0 ){ renderRequestChunk() }
      else{ 
        getCustomTemplates.refetch()
       }
    }
  };

  useEffect(() => {   

    setLoader(true)
    if(tag.length!=0 && page == 1 ) {   
      setUIDs([])
      setAllGIF([])   
      setRefreshLoader(true)   
      getCustomTemplates.refetch()
    }
    else if(tag.length!=0 && text.length==0 && page > 1) {   
      getCustomTemplates.refetch()
    }
    else if(text.length==0 && tag.length==0 && page == 1) {   
      setAllGIF([])   
      setUIDs([])
      setRefreshLoader(true)       
      getCustomTemplates.refetch()
      console.log('here');
    }   
    else if(text.length==0 && tag.length==0 && page > 1) {   
      console.log('Without tag');
      getCustomTemplates.refetch()
    } 
    else if(text.length!=0 && page == 1){
      renderRequestChunk()
    }
    else if(text.length!=0 && page > 1 ) {
      setLoader(false) // kept in synch with Banner
    }

    return()=>{}
  }, [page]);

  useEffect(()=>{
    
    setAllGIF([])
    setUIDs([])
    setPage(1)
    setLimit(25)
    setRefreshLoader(true)
    setLoader(true)
    // setText('')
    getCustomTemplates.refetch()
    return()=>{}
  },[tag])  

  // useFocusEffect(
  //   React.useCallback(() => {
  //     refresh()
  //   }, []),
  // );

  // useEffect(()=>{
  //   setRefreshLoader(false)
  // },[UIDs?.length===allGif?.length])

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  Animated.timing(imageOpacity, {
    toValue: 1,
    duration: 1500, // Fade in duration
    useNativeDriver: true,
  }).start(() => {});

  setTimeout(() => {
    setShowScreen(true) 
  }, 3000);

console.log(allGif?.length);
// console.log(UIDs?.length);
// console.log(getCustomRenders?.isLoading);
// console.log(allGif?.length, UIDs?.length );


  return (
    <>
      {showScreen ? 
       <SafeAreaView style= {{flex:1, backgroundColor:'#25282D' }} >
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding': undefined }
          keyboardVerticalOffset={10}
        >
          {/* Header */}
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center',  backgroundColor:'#000000', padding:RFValue(15) }}>
            <View style={{flexDirection:'row', width:'48%', justifyContent:'space-around'}} >
              <TouchableOpacity style={{ backgroundColor:'#3386FF', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10) }} >
                <Text style={{color:'white', fontSize:RFValue(8), marginTop:RFValue(2), fontFamily:'Lucita-Regular'}} >CUSTOM</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('BannerScreen')}  style={{ backgroundColor:'#A8A9AB', borderRadius: RFValue(20), paddingVertical:RFValue(5), paddingHorizontal:RFValue(10) }} >
                <Text style={{color:'white', fontSize:RFValue(8), marginTop:RFValue(2), fontFamily:'Lucita-Regular' }} >BANNER</Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row', width:'30%', justifyContent:'flex-end'}} >
              {/* <TouchableOpacity>
                <Suggestions width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Download2 width={RFValue(25)} height={RFValue(25)}/>
              </TouchableOpacity> */}
              <TouchableOpacity 
                onPress={()=>{
                  navigation.navigate('SubscriptionScreen',{returnScreen:'CustomScreen', reRender: refresh })
                }} >
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
                    // onChangeText={(e: any) => { setTag(e) }}
                    placeholder={'Search'}
                    returnKeyType= {'search'}
                    onSubmitEditing ={ (e)=>{
                      setLoader(true)
                      setTag(e?.nativeEvent?.text)
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
                <TouchableOpacity onPress={()=> {setTag(''); setVisibleSearch(false) }} >
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
                  ["Random", "Angry", "Happy", "Hi", "Mocking", "Nervous", "Nope", "Reveal", "Sad", "Screen", "Signs", "Sports", "Clothes"].map((data:string, index: number)=>{
                  return(
                      <TouchableOpacity
                        disabled={UIDs?.length !== allGif?.length}
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
          <>
            <AppFlatlist 
              data={allGif}
              API={getCustomTemplates }
              giphy={false}
              refresh = {refresh}
              isLoader={loader}
              setLoader={setLoader}
              refreshLoader={refreshLoader}
              UIDsLength = {UIDs?.length}
              allGifLength = {allGif?.length}
              tag={tag}
              text={text}
              page = {page}
              setPage = {setPage}
              setLimit={setLimit}
              navigation={navigation}
            />
            { UIDs?.length !== allGif?.length  && 
              <View style={{ width:40, height:40, borderRadius:20, flexDirection:'row', alignItems:'center', justifyContent:'center', alignSelf:'center', backgroundColor:'#353535', position:'absolute', top:140  }} >
                <Image
                  source={require('../assets/gifs/loader.gif')}
                  style={{width: 20, height: 20, zIndex:1 }}
                />
              </View>
            } 
          </>          
            
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
                width:'77%',
                fontSize: RFValue(15),
                fontFamily:'arial',
                height: RFValue(40), 
                paddingTop: RFValue(12),
                marginLeft: RFValue(20),
                color:'#000000',
              }}            
            />
            <TouchableOpacity 
              onPress={renderRequestChunk}
            >
            <View style={{padding:RFValue(10)}} >
              {loader ?
                <ActivityIndicator size={'small'} color={'#8d8d8d'} />
                :
                <RightTick width={RFValue(20)} height={RFValue(20)} />
              }
            </View> 
            </TouchableOpacity>
          </View> 
        </KeyboardAvoidingView>
       </SafeAreaView>
     :
      <Animated.View
          collapsable={false}
          style={[{flex:1, backgroundColor:'#3386FF', justifyContent:"center", alignItems:'center', opacity: containerOpacity }]}
        >
          <Animated.Image
            source={require("../assets/pngs/AppLogo.png")}
            style={[ {    
              width: 250,
              height: 250, 
              opacity: imageOpacity 
            }]}
            resizeMode="contain"
          />
      </Animated.View>
    }
    </>
  );
};

export default CustomScreen;


