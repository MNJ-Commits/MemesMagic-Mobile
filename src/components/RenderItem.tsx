import { TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { storeIndividualGifData } from "../store/asyncStorage"
import FastImage from 'react-native-fast-image'
import React from "react"

  
const RenderItems = ({item, giphy, text, textPosition, textBackground, textStroke, color, font, navigation, loader, setLoader, UIDsLength, allGifsLength, appleAccessToken}:any)=>{

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
      // console.log('customURI: ', customURI);
      
      return(
      <TouchableOpacity 
        key={item.uid}
        onPress={()=>{
          if(giphy)
            {
              storeIndividualGifData({src:customURI, width:width, height:height, giphy: giphy, src2: BannerURI });
              navigation.navigate( 'IndividualGiphScreen')
            }
          else{
            storeIndividualGifData({src:customURI, width:width, height:height, uid: id, defaultText:text });
            navigation.navigate( 'IndividualGiphScreen', {uid: id, defaultText:text})
          }
        }} 
        style={{ alignItems:'center', margin:RFValue(5) }} 
        >  
        < >               
           <FastImage
            key={item.index}
            source={{ 
              uri: customURI, 
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
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

export default React.memo(RenderItems)