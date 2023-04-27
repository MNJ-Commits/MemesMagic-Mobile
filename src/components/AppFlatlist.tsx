import React from 'react';
import { TouchableOpacity, Image, ActivityIndicator, } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import { RFValue } from 'react-native-responsive-fontsize';

  const AppFlatlist = ({data, giphy, refresh, isLoader, response, navigation, text, textPosition, textBackground, color, font }:any) =>{ 
      
  return (
    <MasonryList
      data={data}
      numColumns={2}
      keyExtractor={(item: { id: string; }): string => item.id}
      keyboardDismissMode={"on-drag"}
      refreshControlProps={{ title:'Pull to refresh', titleColor:'#7C7E81', tintColor:'transparent'}}
      refreshing={response?.isFetching || isLoader}
      loading={response?.isFetching || isLoader }
      // LoadingView={
      //   <Image
      //     source={require('../assets/gifs/loader.gif')}
      //     style={[{width: 20, height: 20, alignSelf:'center',  position:'absolute' }, isLoader ? {top: -70} : null]}
      //   />
      // }
      
      onRefresh={() => refresh() }
      contentContainerStyle={{margin:RFValue(10)}}
      showsVerticalScrollIndicator={false}
      renderItem={ ({item}:any) => <RenderItems item={item} giphy={giphy} text={text} textPosition={textPosition} textBackground={textBackground} color={color} font={font} navigation={navigation} /> }
    />
  )}

export default AppFlatlist


const RenderItems = ({item, giphy, text, textPosition, textBackground, color, font, navigation}:any)=>{
  
  const customURI: any =  giphy ? item?.template : 
                          item?.template ? `http://18.143.157.105:3000${item?.template}` : 
                          `http://18.143.157.105:3000${item.render}`
  const width: number = item.size[0]
  const height: number = item.size[1]
  const id: number = item.uid  
  
  console.log('color: ', color);
  
  let BannerURI: string = ''
    text ? BannerURI += `?text=${text}` : ''
    BannerURI += `&w=${RFValue(400)}&h=${RFValue(400/width*height)}`
    textBackground ? BannerURI += `&textBackground=${textBackground}` : ''
    textPosition ? BannerURI += `&location=${textPosition}` : ''
    font ? BannerURI += `&font=${font}` : ''
    color ? BannerURI += `&color=${encodeURIComponent(color)}` : ''    
    console.log('color: ', color);
  return(
    <TouchableOpacity 
      key={item.index}
      onPress={()=>{!giphy && navigation.navigate( 'IndividualGiphScreen',{src:customURI, width:width, height:height, uid: id } )}} 
      style={{ alignItems:'center', margin:RFValue(5) }} 
      >  
      < >               
        <Image
          key={item.index}
          source={{ uri: customURI }}
          resizeMode={'contain'}
          style={{ 
            width:'100%', 
            height: RFValue(150/width*height),
            borderRadius:RFValue(10),   
          }}
        />
        {
          giphy && 
            <Image 
              key={item.index}
              source={{uri: `http://18.143.157.105:3000/renderer/banner${BannerURI}`}}
              resizeMode={'contain'}
              style={{
                width:'100%', 
                height:RFValue(150/width*height), 
                position:'absolute',
                borderRadius:RFValue(10),
               }}
            />

          }
          <ActivityIndicator size={'small'} style={{zIndex: -1, position:'absolute', top: RFValue((150/width*height)/2) }} />
      </>

    </TouchableOpacity>
  )
}