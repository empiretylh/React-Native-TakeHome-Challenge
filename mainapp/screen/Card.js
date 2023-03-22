import React from 'react';
import {View,Text,Image,TouchableOpacity,StyleSheet} from 'react-native';
import {IMAGE,COLOR} from '../AssetDatabase';

const Card =({item})=>{
  console.log(item)
 
    // return (<View><Text>{JSON.stringify(item)}</Text></View>)
  
	return(
      <View>
                <View style={{
                   
                alignItems:'center',justifyContent:'center',
                  // position:'relative',
                }}>
                   <Image source={{uri:item.images.large}} style={{width:200,height:260,borderRadius:15,borderRadius:15}}/>
        
                <View style={{
                    // display:'flex',
                    width:'90%',
                    maxWidth:'100%',
                    backgroundColor:'white',
                    alignItems:'center',justifyContent:'center',
                    padding:20,
                    height:240,
                    // position:'absolute',
                    borderRadius:15,
                    bottom:70,
                    zIndex:-1
                }}>
                    
                    <Text style={{fontSize:25,fontWeight:'bold',color:'black',marginTop:10}}>{item.name}</Text>
                    <Text style={{fontSize:15,color:'blue'}}>{item.rarity}</Text>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                     <Text style={{fontSize:20,color:'black',marginRight:20}}>${item.cardmarket.prices.averageSellPrice}</Text>
                      <Text style={{fontSize:20,color:'black',marginLeft:20}}>{item.set.printedTotal} left</Text>
                    </View>
                    <TouchableOpacity
          style={{...styles.button,position:'absolute',bottom:-20,backgroundColor:'orange'}}
          onPress={() => {
            // setToken(true);
          }}>
          <Text style={{color: 'black',fontWeight:'bold',fontSize:18,}}>Select Card</Text>
        </TouchableOpacity>
                    </View>

                  
                </View>
                </View>
		)
}

export default Card;

const styles = StyleSheet.create({
    textfield : {
        backgroundColor:'white',
        padding:8,
        textAlign:'center',
        borderRadius:15,
    },
    choice:{
        display:'flex',
        flexGrow:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        padding:8,
        textAlign:'center',
        borderRadius:15,
        margin:5,
    },
     button: {
    backgroundColor: COLOR.buttoncolor,
    width:'80%',
    padding: 15,
    color: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
})