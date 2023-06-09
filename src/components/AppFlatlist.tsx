import React, { useState } from 'react';
import { TouchableOpacity, Image, ActivityIndicator, } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';
import { loadAppleAccessTokenFromStorage, storeIndividualGifData } from '../store/asyncStorage';
import { useFocusEffect } from '@react-navigation/native';

  const AppFlatlist = ({data, giphy, refresh, isLoader, setLoader, refreshLoader, navigation, text, textPosition, textBackground, textStroke, color, font }:any) =>{ 
    
    console.log("isLoader: ", isLoader);
    
  return (
    <MasonryList
      data={data}
      numColumns={2}
      keyExtractor={(item: { id: string; }): string => item.id}
      keyboardDismissMode={"on-drag"}
      refreshControlProps={{ title:'Loading...', titleColor:'#7C7E81', tintColor:'transparent',  }}
      refreshing={refreshLoader}
      loading={refreshLoader }
      LoadingView={
        <Image
          source={require('../assets/gifs/loader.gif')}
          style={[{width: 20, height: 20, alignSelf:'center',  position:'absolute' }, isLoader ? {top: -70} : null]}
        />
      }
      
      onRefresh={() => refresh() }
      contentContainerStyle={{margin:RFValue(10)}}
      showsVerticalScrollIndicator={false}
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
        />
      }
    />
  )}

export default AppFlatlist


const RenderItems = ({item, giphy, text, textPosition, textBackground, textStroke, color, font, navigation, loader, setLoader}:any)=>{
  

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

  const customURI: any =  giphy ? item?.template : 
                          item?.template ? `http://18.143.157.105:3000${item?.template}` : 
                          `http://18.143.157.105:3000${item.render}`
  const width: number = item.size[0]
  const height: number = item.size[1]
  const id: number = item.uid  
    
  let BannerURI: string = ''
    text ? BannerURI += `?text=${encodeURIComponent(text)}` : ''
    BannerURI += `&w=${RFValue(400)}&h=${RFValue(400/width*height)}`
    textBackground ? BannerURI += `&textBackground=${textBackground}` : ''
    textStroke ? BannerURI += `&s=${textStroke}` : ''
    textPosition ? BannerURI += `&location=${textPosition}` : ''
    font ? BannerURI += `&font=${font}` : ''
    color ? BannerURI += `&color=${encodeURIComponent(color)}` : ''        
    // console.log('BannerURI: ', BannerURI);
    
    return(
    <TouchableOpacity 
      key={item.index}
      onPress={()=>{
        if(giphy)
          {
            storeIndividualGifData({src:customURI, width:width, height:height, giphy: giphy, src2: BannerURI, returnScreen:'BannerScreen'});
            navigation.navigate( 'IndividualGiphScreen')
          }
        else{
          storeIndividualGifData({src:customURI, width:width, height:height, uid: id, defaultText:text, returnScreen:'CustomScreen'});
          navigation.navigate( 'IndividualGiphScreen')
        }
      }} 
      style={{ alignItems:'center', margin:RFValue(5) }} 
      >  
      < >               
        <Image
          key={item.index}
          source={{ uri: customURI }}
          resizeMode={'contain'}
          onLoadEnd={()=>setLoader(false)}
          style={{ 
            zIndex: -1, 
            width:'100%', 
            height: RFValue(150/width*height),
            borderRadius:RFValue(10),   
          }}
        />
          {(loader && !giphy) && <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: 1, position:'absolute', top: RFValue((150/width*height)/2) }} />}
        {
          giphy && 
            <Image 
              key={item.index}
              source={appleAccessToken ? 
                      { 
                        uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`,
                        headers: { "X-ACCESS-TOKEN": `${appleAccessToken}`}   
                      }
                    : {  uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}` }}
              resizeMode={'contain'}
              onLoadStart={()=>setLoader(true)}
              onLoadEnd={()=>setLoader(false)}
              style={{
                width:'100%', 
                height:RFValue(150/width*height), 
                position:'absolute',
                borderRadius:RFValue(10),
              }}
            />
          }
        {/* <ActivityIndicator size={'small'} style={{zIndex: 1, position:'absolute', top: RFValue((150/width*height)/2) }} /> */}
       {(loader && giphy) && <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: 1, position:'absolute', top: RFValue((150/width*height)/2) }} />}
      </>

    </TouchableOpacity>
  )
}