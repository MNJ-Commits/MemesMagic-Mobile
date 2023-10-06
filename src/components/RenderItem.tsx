import { TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { storeIndividualGifData } from "../store/asyncStorage"
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video';
import React from "react"

  
const RenderItem = ({item, giphy, text, textPosition, textBackground, textStroke, color, font, navigation, loader, setLoader, UIDsLength, allGifsLength, appleAccessToken}:any)=>{

  // console.log('item:', item )
  // console.log('giphy:', giphy )

    const customURI: any =  giphy ? item?.template : 
                            item?.template ? `http://18.143.157.105:3000${item?.template}` : 
                            `http://18.143.157.105:3000${item.render}`
    const width: number = item.size[0]
    const height: number = item.size[1]
    const id: number = item.uid  
      
    let BannerURI: string = ''
    if(giphy){
      text ? BannerURI += `?text=${encodeURIComponent(text)}` : ''
      BannerURI += `&w=${RFValue(400)}&h=${RFValue(400/width*height)}`
      textBackground ? BannerURI += `&textBackground=${textBackground}` : ''
      textStroke ? BannerURI += `&s=${textStroke}` : ''
      textPosition ? BannerURI += `&location=${textPosition}` : ''
      font ? BannerURI += `&font=${font}` : ''
      color ? BannerURI += `&color=${encodeURIComponent(color)}` : ''        
     } 
    // console.log('BannerURI: ',  `http://18.143.157.105:3000/renderer/banner${BannerURI}`);
    // console.log('customURI: ', customURI);
    // console.log('appleAccessToken: ', typeof appleAccessToken);
      
      const customURI_parts = customURI.split("/")
      const key = giphy ? customURI_parts[customURI_parts.length - 2] : id

      return(
      <TouchableOpacity 
        // key={giphy ? customURI_parts[customURI_parts.length - 2] : id }
        onPress={()=>{
          if(giphy)
            {
              storeIndividualGifData({src:customURI, width:width, height:height, giphy: giphy, src2: BannerURI });
              navigation.navigate( 'IndividualGiphScreen', {returnScreen : 'BannerScreen'})
            }
          else{
            storeIndividualGifData({src:customURI, width:width, height:height, uid: id, defaultText:text });
            navigation.navigate( 'IndividualGiphScreen', {uid: id, defaultText:text, returnScreen : 'CustomScreen'})
          }
        }} 
        style={{ alignItems:'center', 
          aspectRatio: width/height,
          // height: RFValue(160/width*height), 
          marginVertical: giphy ? RFValue(5) : 0,
        }} 
      >  
        
        <>
          <FastImage
            key={key}
            source={{ 
              uri: customURI, 
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
            onLoadEnd={()=>setLoader(false)}
            style={{ 
              zIndex: 0, 
              width:'90%', 
              aspectRatio: width/height,
              // backgroundColor:'#FF439E',
              // height: RFValue(160/width*height),
              borderRadius:RFValue(8),   
            }}
          />
          <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: -1, position:'absolute', top: RFValue((150/width*height)/2) }} />
        </>
        { giphy &&
          <>
            <FastImage 
              key={key}
              source={appleAccessToken ? 
                      { 
                        uri: giphy && text.length!==0 ? `http://18.143.157.105:3000/renderer/banner${BannerURI}`  : null,
                        headers: { "X-ACCESS-TOKEN": `${appleAccessToken}`}   
                      }
                    : { uri: giphy && text.length!==0 ? `http://18.143.157.105:3000/renderer/banner${BannerURI}` : null }}
              resizeMode={'contain'}
              onLoadStart={()=>setLoader(true)}
              onLoadEnd={()=>setLoader(false)}
              style={{
                width:'100%', 
                // backgroundColor:'pink',
                // height:RFValue(160/width*height), 
                aspectRatio: width/height,
                position:'absolute',
                borderRadius:RFValue(10),
              }}
            />
              
            {/* { loader  &&
              <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: 1, position:'absolute', top: RFValue((150/width*height)/2) }} />} */}
          </>
        }
      </TouchableOpacity>
    )
  }

export default React.memo(RenderItem)