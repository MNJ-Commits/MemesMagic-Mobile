import { TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { storeIndividualGifData } from "../store/asyncStorage"
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video';
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
      
      const customURI_parts = customURI.split("/")
      // console.log(customURI_parts[customURI_parts.length - 2]);

      return(
      <TouchableOpacity 
        key={giphy ? customURI_parts[customURI_parts.length - 2] : id }
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
          {/* <Image
            // source={{uri: gifData?.giphy ? gifData.src : webp }}
            source={{
              uri: customURI,
              cache: 'force-cache' 
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={{ 
              zIndex: 0, 
              width:'100%', 
              height: RFValue(150/width*height),
              borderRadius:RFValue(10),   
            }}
         />  */}

          {/* <Video 
            key={giphy ? customURI_parts[customURI_parts.length - 2] : id }
            // source={require('../assets/video/big_buck_bunny_720p_1mb.mp4')}  // Can be a URL or a local file.
            source={{uri: customURI}}
            repeat={true}
            controls={false}
            resizeMode="contain"
            playInBackground={true}
            disableFocus={true}
            removeClippedSubviews={true}
            onLoadEnd={()=>setLoader(false)}
            style={{ 
              zIndex: 0, 
              width:'100%', 
              height: RFValue(150/width*height),
              borderRadius:RFValue(10),   
            }}
          />  */}
          <FastImage
            key={item.index}
            source={{ 
              uri: customURI, 
              priority: FastImage.priority.normal,
              cache:'immutable'
            }}
            resizeMode={FastImage.resizeMode.contain}
            onLoadEnd={()=>setLoader(false)}
            style={{ 
              zIndex: 0, 
              width:'100%', 
              height: RFValue(150/width*height),
              borderRadius:RFValue(10),   
            }}
          />
          {/* {(loader && !giphy) &&  */}
          <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: -1, position:'absolute', top: RFValue((150/width*height)/2) }} />
        
          {
            giphy &&  
              <Image 
                key={giphy ? customURI_parts[customURI_parts.length - 2] : id }
                source={appleAccessToken ? 
                        { 
                          uri: text ? `http://18.143.157.105:3000/renderer/banner${BannerURI}`  : null,
                          headers: { "X-ACCESS-TOKEN": `${appleAccessToken}`}   
                        }
                      : { uri: text ? `http://18.143.157.105:3000/renderer/banner${BannerURI}` : null }}
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
         {(loader && giphy) &&
          <ActivityIndicator size={'large'}  color={'#FF439E'} style={{zIndex: 1, position:'absolute', top: RFValue((150/width*height)/2) }} />
          }
        </>
  
      </TouchableOpacity>
    )
  }

export default React.memo(RenderItems)