import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';
import { loadAppleAccessTokenFromStorage } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';
import RenderItems from './RenderItem';
import FastImage from 'react-native-fast-image';
import BigList from "react-native-big-list";
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { MasonryFlashList  } from "@shopify/flash-list";


const LIMIT = 25;
const AppFlatlist = ({ data, API, API2, giphy, refresh, isLoader, setLoader, refreshLoader, UIDsLength, allGifLength, page, setPage, tag, navigation, text, textPosition, textBackground, textStroke, color, font }:any) =>{ 
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

    useEffect(()=>{
      
    },[tag])

    // const handleScroll = (event: any) => {      
    //   // console.log("API?.data?.length, ", event.nativeEvent.locationY, API?.data?.length);
    //   // && API?.data?.length == 25 
    //   // console.log("page no: ",data.length, data.length/25, page);
    //   if(event.nativeEvent.locationY<0 && data.length/25===page && page <= 3  )
    //    {
    //     console.log("load");
    //     setPage(page + 1) 
        
    //    }
    //   else if(event.nativeEvent.locationY<0 && data.length/25===page && !tag && !giphy )
    //     {
    //       setPage(page + 1)
    //     }
    //   else if(event.nativeEvent.locationY<0 && API?.data?.length<25)
    //     {
    //       console.log("End reached");
          
    //     }
    //   else if(event.nativeEvent.locationY<0) 
    //     {
    //       // console.log("Yes");
          
    //     }
    // };

    // const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => {
    //     return r1 !== r2;
    // }));

    // const [layoutProvider, setLayoutProvider] = useState(new LayoutProvider(
    //     () => {
    //         return true
    //     },
    //     (type, dim, index) => {
    //       // Calculate the dimensions of each item here
    //       const width: number = data[index]?.size[0]/1.2
    //       const height: number = data[index]?.size[1]

    //       const itemWidth = Dimensions.get('window').width / 2; // Divide screen width by 2 for 2 columns
    //       const itemHeight =  RFValue(150); // Set your desired item height
    //       // const itemHeight =  150/width*height; // Set your desired item height
    //       dim.width = itemWidth;
    //       dim.height = itemHeight;   // height of each item in list,  should be equal to hieght of each view
    //     }
    // ));
  // console.log("API?.isFetching: ",API?.data?.length );
  // console.log("API?.isFetching: ",API?.data?.length );
  // console.log("API2: ",API2.isLoading);
  // console.log("page: ",page);
  // console.log("API3: ",!API2.isLoading, API2?.data?.length!=0, API?.data?.length, !API2.isLoading && API2?.data?.length!==0 && API?.data?.length!==0);
  
    return (

      <MasonryFlashList
        data={data}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={"on-drag"}
        removeClippedSubviews={true}
        estimatedItemSize={150}
        refreshControl={
          <RefreshControl
            refreshing={API?.isFetching}
            onRefresh={refresh}
            enabled={API?.isFetching}
            // tintColor={'transparent'}
            colors={['#FF439E']}
            progressBackgroundColor={'#3386FF'}
          />
        }
        ListEmptyComponent={
          API?.isFetching ? (
            // Loading
              <Text style={{color: '#ffffff', fontFamily:'Lucita-Regular', fontSize: RFValue(12), paddingBottom: RFValue(5), alignSelf:'center', marginTop: RFValue(50),}}> Loading... </Text>
          ) : API?.data?.length !== 0 ? (
            <Text></Text>
          ) : (
            // No gif found
            <Text style={{color: '#ffffff', fontFamily:'Lucita-Regular', fontSize: RFValue(12), paddingBottom: RFValue(5), alignSelf:'center', marginTop: RFValue(20),}}>No content found</Text>
          )
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {          
          API?.data?.length === LIMIT && data.length/25===page && page<=3 ?
            setPage(page + 1)
          : API?.data?.length <= LIMIT && giphy && page<=3 ?
            setPage(page + 1)
          : !tag && !giphy ?
            setPage(page + 1)
          : null
        }}
        ListFooterComponent={ 
          API?.isFetching && allGifLength === 0 ? <Text></Text> :
          // (giphy && API?.data?.length>=0 && API?.data?.length<LIMIT) ? <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:20, paddingBottom:30 }} >At the bottom</Text>: 
          // (!API2.isLoading && text!=='') ||  (API?.data?.length>=0 && API?.data?.length<LIMIT) ? <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:20, paddingBottom:30 }} >At the bottom</Text>: 
          // (!API2.isLoading && !API.isLoading && text==='' ) ? <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:20, paddingBottom:30 }} >Refresh</Text>: 
        (API?.data?.length <= LIMIT && giphy && page<=3 ) || (!API.isLoading && API?.data?.length===LIMIT && page<=3 && tag) ? <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >Load More</Text>:
        (API?.data?.length == LIMIT && !tag && !giphy) ? <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >Load More</Text>:
        <Text></Text>
        }
        extraData={[giphy, text, textPosition, textBackground, textStroke, color, font, isLoader, setLoader, appleAccessToken]}
        renderItem={({ item, extraData}) => 
          <RenderItems 
            extraData={extraData}
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
          />}
      />

  // <BigList
  //   data={data}
  //   keyExtractor={item => item.id}
  //   numColumns={2}
  //   removeClippedSubviews={true}
  //   style={{flex: 1 }}
  //   getItemLayout={(data, index) => ({
  //     length: 100,
  //     offset: 100 * index,
  //     index,
  //   })}
  //   renderItem={(item) => {
  //     // console.log('item:', item.item.size[1] )
  //     return (
  //       <RenderItems 
  //         item={item.item} 
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
  //       )}
  //     }
  // />

  // <MasonryList
  //   keyExtractor={(item: { id: string; }): string => item.id}
  //   data={data}
  //   numColumns={2}
  //   keyboardDismissMode={"on-drag"}
  //   onRefresh={() => refresh() }
  //   refreshing={ giphy ? ( refreshLoader ) : UIDsLength !== allGifLength }  // drag down's the list
  //   refreshControlProps={{ tintColor:'transparent' }}
  //   contentContainerStyle={{margin:RFValue(10)}}
  //   showsVerticalScrollIndicator={false}
  //   removeClippedSubviews={true}
  //   onTouchEnd ={handleScroll}
  //   ListFooterComponent={ 
  //     endReached && allGifLength!==0 ?
  //     <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >End Reached</Text>: 
  //     !endReached && allGifLength!==0 ? 
  //     <Text style={{fontFamily:'Lucita-Regular', color:'white', fontSize:14, alignSelf:'center', paddingTop:10, paddingBottom:30 }} >Load More</Text>:
  //     <Text></Text>
  //   }
  //   ListEmptyComponent={
  //     isLoader || refreshLoader ? 
  //       <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}} >Loading ... </Text>
  //     : data.length === 0 ?
  //       <Text style={{fontSize:12, color:'#7C7E81', alignSelf:'center', marginTop:100}}>No Content Found</Text>
  //     : <></>
  //   }
  //   renderItem={ ({item}:any) =>
  //    <RenderItems 
  //     item={item} 
  //     giphy={giphy} 
  //     text={text} 
  //     textPosition={textPosition}
  //     textBackground={textBackground} 
  //     textStroke={textStroke} 
  //     color={color} 
  //     font={font} 
  //     navigation={navigation}
  //     setLoader={setLoader}
  //     loader={isLoader}
  //     appleAccessToken={appleAccessToken}
  //     />
  //   }
  // />

  // <BigList 
  //   data={[1]}
  //   getItemLayout={(data1, index) => ({
  //     length: 1000 ,
  //     offset: 20000 * index,
  //     index,
  //   })} 
  //   renderItem={(item:any) => { 
  //     function splitArrayByIndexes(inputArray: any) {
  //       const evenIndexesArray = [];
  //       const oddIndexesArray = [];
    
  //       for (let i = 0; i < inputArray.length; i++) {
  //         if (i % 2 === 0) {
  //           evenIndexesArray.push(inputArray[i]);
  //         } else {
  //           oddIndexesArray.push(inputArray[i]);
  //         }
  //       }
    
  //       return [evenIndexesArray, oddIndexesArray];
  //     }
    
  //     const originalArray = data;
  //     const [evenArray, oddArray] = splitArrayByIndexes(originalArray);
    
  //     // console.log("Even Indexes Array:", evenArray);
  //     // console.log("Odd Indexes Array:", oddArray);

  //     return (   
  //       <ScrollView style={{ flexGrow:1}} >
  //         <View style={{flexDirection:'row', justifyContent:'space-around', width:"100%",  alignSelf:'center' }} >
  //           <View style={{  width:'47%' }}>
  //             <> 
  //             {   
  //               evenArray.map((items:any)=>{
  //                 const customURI: any =  giphy ? items?.template : 
  //                             items?.template ? `http://18.143.157.105:3000${items?.template}` : 
  //                             `http://18.143.157.105:3000${items.render}`
  //                 const width: number = items.size[0]
  //                 const height: number = items.size[1]
  //                 // console.log( items, "here");
                  
  //                 return(
  //                     <FastImage
  //                       key={items.index}
  //                       source={{ 
  //                         uri: customURI, 
  //                         priority: FastImage.priority.normal,
  //                       }}
  //                       resizeMode={FastImage.resizeMode.contain}
  //                       onLoadEnd={()=>setLoader(false)}
  //                       style={{ 
  //                         // backgroundColor:"pink",
  //                         zIndex: -1, 
  //                         width:'100%', 
  //                         height: RFValue(150/width*height),
  //                         borderRadius:RFValue(10),   
  //                         marginVertical:5
  //                       }}
  //                     />                        
  //                   )
  //                 })
  //               }
  //               {
  //               oddArray.map((items:any)=>{
  //                 const customURI: any =  giphy ? items?.template : 
  //                             items?.template ? `http://18.143.157.105:3000${items?.template}` : 
  //                             `http://18.143.157.105:3000${items.render}`
  //                 const width: number = items.size[0]
  //                 const height: number = items.size[1]
  //                 // console.log( items, "here");
                  
  //                 return(
  //                     <FastImage
  //                       key={items.index}
  //                       source={{ 
  //                         uri: customURI, 
  //                         priority: FastImage.priority.normal,
  //                       }}
  //                       resizeMode={FastImage.resizeMode.contain}
  //                       onLoadEnd={()=>setLoader(false)}
  //                       style={{ 
  //                         zIndex: -1, 
  //                         width:'100%', 
  //                         height: RFValue(150/width*height),
  //                         borderRadius:RFValue(10),   
  //                         marginVertical:5
  //                       }}
  //                     />
  //                   )
  //                 })
  //             }
  //             </>
  //           </View>    
  //           <View style={{ width:'47%' }}>
  //             <>
  //           { oddArray.map((items:any)=>{
  //               const customURI: any =  giphy ? items?.template : 
  //                           items?.template ? `http://18.143.157.105:3000${items?.template}` : 
  //                           `http://18.143.157.105:3000${items.render}`
  //               const width: number = items.size[0]
  //               const height: number = items.size[1]
  //               // console.log( items, "here");
                
  //               return(
  //                   <FastImage
  //                     key={items.index}
  //                     source={{ 
  //                       uri: customURI, 
  //                       priority: FastImage.priority.normal,
  //                     }}
  //                     resizeMode={FastImage.resizeMode.contain}
  //                     onLoadEnd={()=>setLoader(false)}
  //                     style={{ 
  //                       zIndex: -1, 
  //                       width:'100%', 
  //                       height: RFValue(150/width*height),
  //                       borderRadius:RFValue(10),   
  //                       marginVertical:5
  //                     }}
  //                   />
  //                 )
  //               })
  //             }
  //            { evenArray.map((items:any)=>{
  //                 const customURI: any =  giphy ? items?.template : 
  //                             items?.template ? `http://18.143.157.105:3000${items?.template}` : 
  //                             `http://18.143.157.105:3000${items.render}`
  //                 const width: number = items.size[0]
  //                 const height: number = items.size[1]
  //                 // console.log( items, "here");
                  
  //                 return(
  //                     <FastImage
  //                       key={items.index}
  //                       source={{ 
  //                         uri: customURI, 
  //                         priority: FastImage.priority.normal,
  //                       }}
  //                       resizeMode={FastImage.resizeMode.contain}
  //                       onLoadEnd={()=>setLoader(false)}
  //                       style={{ 
  //                         // backgroundColor:"pink",
  //                         zIndex: -1, 
  //                         width:'100%', 
  //                         height: RFValue(150/width*height),
  //                         borderRadius:RFValue(10),   
  //                         marginVertical:5
  //                       }}
  //                     />                        
  //                   )
  //                 })
  //               }
                
  //             </>
  //           </View>
  //         </View>
  //       </ScrollView> 
  //     )
  // }}
  // />

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
  //       )}
  //     }
  // />

    )}

export default AppFlatlist



 