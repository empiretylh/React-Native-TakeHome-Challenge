import * as React from 'react';
import { useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, FlatList, TextInput, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { IMAGE, COLOR } from '../AssetDatabase';
import Icons from 'react-native-vector-icons/Ionicons';
import Card from './Card'
import { QueryClient, QueryClientProvider, useInfiniteQuery, useQuery } from 'react-query';
const queryClient = new QueryClient();



const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2/cards';


const Home = ({ navigation }) => {
  const fetchPokemon = async ({ pageParam = 1 }) => {
    console.log(pageParam,'I will Fetch this page Param')
    const response = await fetch(`${POKEMON_TCG_API}?pageSize=12&page=${pageParam}`);
    const data = await response.json();
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, } = useInfiniteQuery('pokemon', fetchPokemon,
    {
      getNextPageParam: (lastPage) => lastPage.page + 1,
    });

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }




  // const { data, isLoading, isError } = useQuery(['cards', page, pageSize], fetchCards)
  // const cards = data ? data.pages[0].data : [];


  // console.log(cards);
  const renderFooter = () => {
    // if (!isFetchingMore) return null;
    return (
      <View style={{ paddingVertical: 20,width:'100%',alignItems:'center',justifyContent:'center' }}>
        {isFetchingNextPage?
      <ActivityIndicator/>
        : <TouchableOpacity onPress={() => {
          if (hasNextPage) {
            console.log('Fetching Next Page')
            fetchNextPage();
          }
        }} style={{display:'flex',flexDirection:'row',alignItems:'center'}} >
          <Icons name='search' size={20} style={{marginRight:10}} color={'#000'}/>
          <Text style={{color:'black',fontSize:18}}>show more</Text>
          
        </TouchableOpacity>
      }
       
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{marginTop:80,marginBottom:20}}>
        <TextInput style={styles.textfield} placeholder={'Name..'} />
        <View style={{ marginTop: 5, display: 'flex', flexDirection: 'row' }}>
          <TouchableOpacity style={styles.choice}>
            <Text styles={{ color: 'black', fontSize: 15 }}>Type </Text>
            <Icons name='chevron-down' color={'#000'} size={15} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.choice}>
            <Text styles={{ color: 'black', fontSize: 15 }}>Rarity </Text>
            <Icons name='chevron-down' color={'#000'} size={15} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.choice}>
            <Text styles={{ color: 'black', fontSize: 15 }}>Set </Text>
            <Icons name='chevron-down' color={'#000'} size={15} />
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View >
        <View style={{ position: 'absolute',height:80, backgroundColor: 'white', padding: 5, display: 'flex', alignItems: 'center', width: '100%', zIndex: 1 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>TCG Marketplace</Text>
          <Image source={IMAGE.header} style={{height:80,width:120,position:'absolute',bottom:-25}} resizeMode={'contain'}/>
        </View>
        <View style={{padding: 20, }}>
         
          <FlatList

            data={data?.pages?.flatMap((page) => page.data) ?? []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={Card}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={renderHeader}
            onEndReachedThreshold={0.5}
            // onEndReached={() => fetchMore()}
             refreshing={isFetchingNextPage}
          // onRefresh={() => fetchMore({ refetchAll: true })}
          />
        </View>

      </View>
    </QueryClientProvider>
  )
}


const styles = StyleSheet.create({
  textfield: {
    backgroundColor: 'white',
    padding: 8,
    textAlign: 'center',
    borderRadius: 15,
  },
  choice: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    textAlign: 'center',
    borderRadius: 15,
    margin: 5,
  },
  button: {
    backgroundColor: COLOR.buttoncolor,
    width: '80%',
    padding: 15,
    color: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
})
export default Home;

