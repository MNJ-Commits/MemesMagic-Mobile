import React, { useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, View, Text, RefreshControl, FlatList, } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';
import { loadAppleAccessTokenFromStorage, storeIndividualGifData } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import RenderItems from './RenderItem';



const AppFlatlist = ({ data, API, giphy, refresh, isLoader, setLoader, refreshLoader, UIDsLength, allGifLength, page, setPage, navigation, text, textPosition, textBackground, textStroke, color, font }:any) =>{ 

  
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

    const handleScroll = (event: any) => {      
      // console.log("API?.data?.length, ", event.nativeEvent.locationY, API?.data?.length);
      
      if(event.nativeEvent.locationY<0 && API?.data?.length == 30)
        { setPage(page + 1) }
      else if(event.nativeEvent.locationY<0 && API?.data?.length<30)
        console.log("End reached");
    };
  
  return (
    <MasonryList
      keyExtractor={(item: { id: string; }): string => item.id}
      data={data}
      numColumns={2}
      keyboardDismissMode={"on-drag"}
      onRefresh={() => refresh() }
      refreshing={ giphy ? ( refreshLoader ) : UIDsLength !== allGifLength }
      refreshControlProps={{  tintColor:'transparent' }}
      contentContainerStyle={{margin:RFValue(10)}}
      showsVerticalScrollIndicator={false}
      onTouchEnd ={handleScroll}
      ListEmptyComponent={
        isLoader || refreshLoader ? 
          <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}} >Loading ... </Text>
        : data.length == 0 ?
          <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}}>No Content Found</Text>
        : <></>
      }
      renderItem={ ({item}:any) =>
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



 