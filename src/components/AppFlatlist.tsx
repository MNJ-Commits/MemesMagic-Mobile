import React, { useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, View, Text, RefreshControl, FlatList, Dimensions, } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';
import { loadAppleAccessTokenFromStorage, storeIndividualGifData } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import RenderItems from './RenderItem';
import LottieView from 'lottie-react-native';
import { RecyclerListView, DataProvider, LayoutProvider, Dimension } from "recyclerlistview";


const AppFlatlist = ({ data, API, giphy, refresh, isLoader, setLoader, refreshLoader, UIDsLength, allGifLength, page, setPage, tag, navigation, text, textPosition, textBackground, textStroke, color, font }:any) =>{ 
  
  // console.log("API: ", API.data.length);
  
    // const columnCount = 2; // Number of columns
    // const totalWidth = Dimensions.get('window').width;
    // const marginBetweenItems = 10; // Set your desired margin

    // const itemWidth = (totalWidth - (marginBetweenItems * (columnCount - 1))) / columnCount;
    
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
      // && API?.data?.length == 25 
      
      if(event.nativeEvent.locationY<0 && data.length/25===page && page <= 3  )
        setPage(page + 1) 
      else if(event.nativeEvent.locationY<0 && data.length/25===page && !tag && !giphy )
        setPage(page + 1)
      else if(event.nativeEvent.locationY<0 && API?.data?.length<25)
        console.log("End reached");
    };

    // const dataProvider = new DataProvider((r1, r2) => {    
    //   return r1 !== r2;
    // });
  
    // const layoutProvider = new LayoutProvider(
    //   index => index, // Assigns unique keys to items
    //   (type, dim, index) => {
    //     // Calculate the dimensions of each item here
    //     const width: number = data[index]?.size[0]/1.2
    //     const height: number = data[index]?.size[1]

    //     const itemWidth = Dimensions.get('window').width / 2; // Divide screen width by 2 for 2 columns
    //     const itemHeight =  150/width*height; // Set your desired item height
    //     dim.width = itemWidth;
    //     dim.height = itemHeight;
    //   }
    // );
    
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
      // onEndReachedThreshold={0.5}
      // onEndReached={()=> setPage(page + 1)}
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

    // <RecyclerListView
    //   // onEndReachedThreshold={1}
    //   // onEndReached={API.data.length===25 ? setPage(page + 1) : null}
    //   dataProvider={dataProvider.cloneWithRows(data)}
    //   layoutProvider={layoutProvider}
    //   rowRenderer={(type, item) => {
    //     return (
    //       <RenderItems 
    //         item={item} 
    //         giphy={giphy} 
    //         text={text} 
    //         textPosition={textPosition}
    //         textBackground={textBackground} 
    //         textStroke={textStroke} 
    //         color={color} 
    //         font={font} 
    //         navigation={navigation}
    //         setLoader={setLoader}
    //         loader={isLoader}
    //         appleAccessToken={appleAccessToken}
    //         />
    //     )
    //   }}
    // />
  )}

export default AppFlatlist



 