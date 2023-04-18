import React from 'react';
import { Text, View, TouchableOpacity, Image, Animated, Easing, } from 'react-native';
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
      LoadingView={
        <Image
          source={require('../assets/gifs/loader.gif')}
          style={[{width: 20, height: 20, alignSelf:'center',  position:'absolute' }, isLoader ? {top: -80} : null]}
        />
      }
      
      onRefresh={() => refresh() }
      contentContainerStyle={{margin:RFValue(10)}}
      showsVerticalScrollIndicator={false}
      renderItem={ ({item}:any) => <RenderItems item={item} giphy={giphy} text={text} textPosition={textPosition} textBackground={textBackground} color={color} font={font} navigation={navigation} /> }
    />
  )}

export default AppFlatlist


const RenderItems = ({item, giphy, text, textPosition, textBackground, color, font, navigation}:any)=>{
  
  
  const uri: any =  giphy ? item?.template : 
                    item?.template ? `http://18.143.157.105:3000${item?.template}` : 
                    `http://18.143.157.105:3000${item.render}`
  const width: number = item.size[0]
  const height: number = item.size[1]
  const id: number = item.uid
  
  // &color=${color}
  return(
    <TouchableOpacity 
      key={item.index}
      onPress={()=>{!giphy && navigation.navigate( 'IndividualGiphScreen',{src:uri, width:width, height:height, uid: id } )}} 
      style={{ alignItems:'center', margin:RFValue(5) }} 
      >  
      
      <View style={{width:'100%', height: RFValue(200/width*height),}} >               
        <Image
          key={item.index}
          source={{ uri: uri }}
          resizeMode={'cover'}
          style={{ 
            width:'100%', 
            height: RFValue(200/width*height),
            borderRadius:RFValue(10), }}
        />
        {
          giphy && 
            // <Image
            //   key={item.index}
            //   source={require('../assets/pngs/watermark.png')}
            //   resizeMode={'contain'}
            //   style={{ 
            //     width:RFValue(20), 
            //     height:RFValue(10),
            //     position:'absolute',
            //     bottom:RFValue(5),
            //     left:RFValue(5),
            //   }}
            // />
            <Image 
              key={item.index}
              source={{uri: `http://18.143.157.105:3000/renderer/banner?text=${text}&w=${180}&h=${RFValue(200/width*height)}&textBackground=${textBackground}&location=${textPosition}`}}
              style={{width:'100%', height:RFValue(200/width*height), position:'absolute'}}
            />

          }
      </View>
      {/* <View style={
        [{height: 30, alignItems:'center', position: 'absolute'},
          textPosition=='top' ? {top:20, } :
          {bottom:20}
        ]}>
        {giphy && <Text  style={{color:'#ffffff', fontSize:12, fontWeight:'bold' }}>{text}</Text>}
      </View> */}

    </TouchableOpacity>
  )
}