import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native"


export const RenderCellItems = ({item}:any)=> {

  
  
  // if (item.item.bottom)
  //   console.log( `${item.item.bottom[0].template}`, `${item.item.bottom[0]}`);
  
    return(
    <View key={item.index} >

      { 
        // item.index == 0 ?
        item.item.bottom ?
        <View style={{flexDirection:'column', padding:10, }}>
          <View style={{flexDirection:'row', justifyContent:'space-between' }} >
            <TouchableOpacity onPress={()=>{}} style={{backgroundColor:'pink', width:'48%', height:100, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10 }} >                
              <Image
                key={item.index}
                source={{uri: item.item.bottom[0].template ? `http://18.143.157.105:3000${item.item.bottom[0].template}` : `http://18.143.157.105:3000${item.item.bottom[0]}`}}
                resizeMode={'stretch'}
                style={[{width:'100%', height:100, borderRadius:10  } ]}
                />
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'pink', width:'48%', height:100, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10 }} >
              <Image
                key={item.index}
                source={{uri: `http://18.143.157.105:3000${ item.item.bottom[1].template}`}}
                resizeMode={'stretch'}
                style={[{width:'100%', height:100, borderRadius:10  } ]}
              />
            </TouchableOpacity>
          </View> 
          <View style={{ paddingTop:10 }} >
            <TouchableOpacity style={{ backgroundColor:'pink',  height:125, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10  }} >
              <Image
                key={item.index}
                source={{uri: `http://18.143.157.105:3000${ item.item.bottom[2].template}`}}
                resizeMode= 'stretch'
                style={[{width:'100%', height:125, borderRadius:20  } ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        // : item.index % 3 == 1 ?
        : item.item.right ?
        <View style={{flexDirection:'column', padding:10,  }}>
          <View style={{flexDirection:'row', justifyContent:'space-between' }} >
            <View style={{flexDirection:'column', justifyContent:'space-between', width:'48%', }} >
              <TouchableOpacity style={{backgroundColor:'pink', height:95, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10, }} >
                {/* <Text style={{color:'#000000' }} >{4}</Text> */}
                <Image
                  key={item.index}
                  source={{uri: `http://18.143.157.105:3000${item.item.right[0] || item.item.right[0].template}`}}
                  resizeMode={'stretch'}
                  style={[{ width:'100%', height:95, borderRadius:10  } ]}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor:'pink', height:95, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10 }} >
                {/* <Text style={{color:'#000000'}} >{5}</Text> */}
                <Image
                  key={item.index}
                  source={{uri: `http://18.143.157.105:3000${item.item.right[1] || item.item.right[1].template}`}}
                  resizeMode={'stretch'}
                  style={[{ width:'100%', height:95, borderRadius:10  } ]}
                />
              </TouchableOpacity>
            </View> 
              <TouchableOpacity style={{ backgroundColor:'pink', width:'48%', height:200, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:10  }} >
                {/* <Text style={{color:'#000000'}} >{6}</Text> */}
                <Image
                  key={item.index}
                  source={{uri: `http://18.143.157.105:3000${item.item.right[2] || item.item.right[2].template}`}}
                  resizeMode={'stretch'}
                  style={[{ width:'100%', height:200, borderRadius:10  } ]}
                />
              </TouchableOpacity>
          </View>
        </View>

        // : item.index % 3 == 2 ?
        : item.item.left ?
        <View style={{flexDirection:'column', padding:10 }}>
          <View style={{flexDirection:'row', justifyContent:'space-between',}} >
            <View style={{ width:'48%', }} >
              <View style={{ backgroundColor:'pink',  height:200, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20  }} >
                <Text style={{color:'#000000'}} >{7}</Text>
              </View>
            </View>
            <View style={{flexDirection:'column', justifyContent:'space-between', width:'48%', }} >
              <View style={{backgroundColor:'pink', height:95, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20, }} >
                <Text style={{color:'#000000' }} >{8}</Text>
              </View>
              <View style={{backgroundColor:'pink', height:95, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20 }} >
                <Text style={{color:'#000000'}} >{9}</Text>
              </View>
            </View> 
          </View>
        </View>
        // : item.index % 3 == 0 ?
        : item.item.top ?
          <View style={{flexDirection:'column', padding:10, }}>
            <View style={{ backgroundColor:'pink',  height:125, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20  }} >
              <Text style={{color:'#000000'}} >{10}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:10 }} >
              <View style={{backgroundColor:'pink', width:'48%', height:100, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20 }} >
                <Text style={{color:'#000000' }} >{11}</Text>
              </View>
              <View style={{backgroundColor:'pink', width:'48%', height:100, justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:20 }} >
                <Text style={{color:'#000000'}} >{12}</Text>
              </View>
            </View> 
          </View>
        : null
      }
    </View>
  )
}