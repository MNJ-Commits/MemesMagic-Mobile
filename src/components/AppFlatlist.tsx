import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, View, Text, RefreshControl, FlatList, } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';
import { loadAppleAccessTokenFromStorage, storeIndividualGifData } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import RenderItems from './RenderItem';
import LottieView from 'lottie-react-native';



const AppFlatlist = ({ data, API, giphy, refresh, isLoader, setLoader, refreshLoader, UIDsLength, allGifLength, page, setPage, tag, navigation, text, textPosition, textBackground, textStroke, color, font }:any) =>{ 
  
    const [endReached, setEndReached] = useState<Boolean>(false) 
    const [appleAccessToken, setAppleAccessToken] = useState<string>('')
    const getter = async () => {
      
      const access_token = await loadAppleAccessTokenFromStorage().catch((error:any)=>{
          console.log('loadAppleAccessTokenFromStorage Error: ', error);
      })
      setAppleAccessToken(access_token) 
    }
  
    useFocusEffect(
      React.useCallback(() => {
        getter().catch((error:any)=>{
        console.log('getter Error: ', error);
        })
      }, []),
    );

    useEffect(()=>{
      setEndReached(false)
    },[tag])

    const handleScroll = (event: any) => {      
      // console.log("API?.data?.length, ", event.nativeEvent.locationY, API?.data?.length);
      // && API?.data?.length == 25 
      // console.log("page no: ",data.length, data.length/25, page);
      if(event.nativeEvent.locationY<0 && data.length/25===page && page <= 3  )
       {
        console.log("load");
        setPage(page + 1) 
        setEndReached(false)
       }
      else if(event.nativeEvent.locationY<0 && data.length/25===page && !tag && !giphy )
        {
          setPage(page + 1)
          setEndReached(false)}
      else if(event.nativeEvent.locationY<0 && API?.data?.length<25)
        {
          console.log("End reached");
          setEndReached(true)
        }
      else if(event.nativeEvent.locationY<0) 
        {
          console.log("Yes");
          setEndReached(true)
        }
    };

    return (
    <MasonryList
      keyExtractor={(item: { id: string; }): string => item.id}
      data={data}
      numColumns={2}
      keyboardDismissMode={"on-drag"}
      onRefresh={() => refresh() }
      refreshing={ giphy ? ( refreshLoader ) : UIDsLength !== allGifLength }  // drag down's the list
      refreshControlProps={{ tintColor:'transparent' }}
      contentContainerStyle={{margin:RFValue(10)}}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onTouchEnd ={handleScroll}
      ListFooterComponent={ 
        endReached && allGifLength!==0 ?
        <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >End Reached</Text>: 
        !endReached && allGifLength!==0 ? 
        <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >Load More</Text>:
        <Text></Text>
      }
      // onEndReachedThreshold={0.1}
      ListEmptyComponent={
        isLoader || refreshLoader ? 
          <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}} >Loading ... </Text>
        : data.length === 0 ?
          <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}}>No Content Found</Text>
        : <></>
      }
      renderItem={ ({item}:any) =>
      // <>
      //   <LottieView source={require('../assets/json/animation_llf4yqxh.json')} style={{ height:200}} autoPlay loop />
      //   {/* <LottieView source={require('../assets/json/lottie.json')} style={{ height:100}} autoPlay loop /> */}
      // </>
       <RenderItems 
        item={item} 
        giphy={giphy} 
        text={text} 
        textPosition={textPosition}
        textBackground={textBackground} 
        textStroke={textStroke} 
        color={color} 
        font={font} 
        navigation={navigation}
        setLoader={setLoader}
        loader={isLoader}
        appleAccessToken={appleAccessToken}
        />
      }
    />
  )}

export default AppFlatlist



 