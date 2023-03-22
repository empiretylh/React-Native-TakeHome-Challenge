import React from 'react';
import {useState, useRef, useReducer, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {IMAGE, COLOR} from '../AssetDatabase';
import {SelectedContext} from '../context/context';
import Icons from 'react-native-vector-icons/Ionicons';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from 'react-query';
import {CustomModal} from '../extra/CustomModal';
const queryClient = new QueryClient();

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2/cards';

function cartReducer(state, action) {
  switch (action.type) {
    case 'increase':
      console.log('Increasing 22');
      const data = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                qty: item.qty + 1,
                bqty: item.bqty - 1,
                totalprice: item.price * (item.qty + 1),
              }
            : item,
        ),
      };
      console.log(data);
      return data;
    case 'decrease':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                qty: item.qty - 1,
                bqty: item.bqty + 1,
                totalprice: item.price * (item.qty - 1),
              }
            : item,
        ),
      };
    case 'add':
      console.log('add', action.payload);
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
      };
    case 'remove':
      const updatedItems = state.items.filter(
        item => item.id !== action.payload.id,
      );
      return {...state, items: updatedItems};

    case 'clear':
      return {items: []};
    default:
      throw new Error();
  }
}

const Home = ({navigation}) => {
  const [searchText, setSearchText] = useState('');

  // const [cartItems, setCartItems] = useState([]);

  const fetchPokemon = async ({pageParam = 1}) => {
    const response = await fetch(
      `${POKEMON_TCG_API}?name:${searchText}&pageSize=12&page=${pageParam}`,
    );
    const data = await response.json();
    return data;
  };

  const [cartItems, dispatch] = useReducer(cartReducer, {items: []});

  const [ispay, setIsPay] = useState(false);

  const [showType, setShowType] = useState(false);
  const [selectType, setSelectType] = useState('All');

  const [showRarity, setShowRarity] = useState(false);
  const [selectRarity, setSelectRarity] = useState('All');

  const [showSet, setShowSet] = useState(false);
  const [selectSet, setSelectSet] = useState('All');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery('pokemon', fetchPokemon, {
    getNextPageParam: lastPage => lastPage.page + 1,
  });

  const [showCartList, setShowCartList] = useState(false);

  const FilterType = useMemo(() => {
    if (data) {
      const initialdata = data?.pages?.flatMap(page => page.data);
      const types = initialdata.map((item, index) => item.types[0]);
      const rarity = initialdata.map((item, index) => item.rarity);
      const set = initialdata.map((item, index) => item.set.name);
      // console.log(set)
      return {
        types: [...new Set(types)],
        rarity: [...new Set(rarity)],
        set: [...new Set(set)],
      };
    }
    return {
      types: [],
      rarity: [],
      set: [],
    };
  }, [data]);

  const ShowData = useMemo(() => {
    if (data) {
      const initialdata = [
        ...JSON.parse(JSON.stringify(data?.pages?.flatMap(page => page.data))),
      ];
      const filter = initialdata.filter(e => e.name.includes(searchText));

      let final =
        selectRarity !== 'All'
          ? filter.filter(e => e.rarity === selectRarity)
          : filter;
      final =
        selectType !== 'All'
          ? final.filter(e => e.types[0] === selectType)
          : final;

      final =
        selectSet !== 'All'
          ? final.filter(e => e.set.name === selectSet)
          : final;

      return final;
    }
  }, [data?.pages, searchText, selectType, selectRarity, selectSet]);

  const ComputeTotalPrice = useMemo(() => {
    if (cartItems.items.length > 0) {
      let totalprice = 0;
      cartItems.items.map((iv, index) => {
        totalprice = iv.totalprice + totalprice;
      });
      return totalprice.toFixed(2);
    }
    return 0;
  }, [cartItems.items]);

  const handleCart = item => {
    const dataformat = {
      id: item.id,
      name: item.name,
      price: item.cardmarket.prices.averageSellPrice,
      bqty: item.set.total,
      qty: 1,
      totalprice: item.cardmarket.prices.averageSellPrice * 1,
      image: item.images.large,
    };
    dispatch({type: 'add', payload: dataformat});
  };

  const removeCart = id => {
    dispatch({type: 'remove', payload: {id}});
  };

  const IncreaseItem = id => {
    dispatch({type: 'increase', payload: {id}});
  };

  const DecreaseItem = id => {
    dispatch({type: 'decrease', payload: {id}});
  };

  const RenderCard = ({item}) => {
    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // position:'relative',
          }}>
          <Image
            source={{uri: item.images.large}}
            style={{
              width: 200,
              height: 260,
              borderRadius: 15,
              borderRadius: 15,
            }}
          />

          <View
            style={{
              // display:'flex',
              width: '90%',
              maxWidth: '100%',
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              height: 240,
              // position:'absolute',
              borderRadius: 15,
              bottom: 70,
              zIndex: -1,
            }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: 'black',
                marginTop: 10,
              }}>
              {item.name}
            </Text>
            <Text style={{fontSize: 15, color: 'blue'}}>{item.rarity}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 20, color: 'black', marginRight: 20}}>
                ${item.cardmarket.prices.averageSellPrice}
              </Text>
              <Text style={{fontSize: 20, color: 'black', marginLeft: 20}}>
                {item.set.total} left
              </Text>
            </View>
            {cartItems.items.some(obj => obj.id === item.id) ? (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  position: 'absolute',
                  bottom: -20,
                  backgroundColor: 'black',
                }}
                onPress={() => {
                  removeCart(item.id);
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                  Selected Card
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  ...styles.button,
                  position: 'absolute',
                  bottom: -20,
                  backgroundColor: 'orange',
                }}
                onPress={() => handleCart(item)}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
                  Select Card
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View style={{marginTop: 80, marginBottom: 20}}>
        <TextInput
          style={styles.textfield}
          placeholder={'Name..'}
          onChangeText={e => setSearchText(e)}
        />
        <View style={{marginTop: 5, display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              ...styles.choice,
              backgroundColor:
                selectType === 'All' ? '#fff' : COLOR.buttoncolor,
            }}
            onPress={() => setShowType(true)}>
            <Text
              style={{
                color: selectType === 'All' ? 'black' : 'white',
                fontSize: 15,
              }}>
              {selectType === 'All' ? 'Type ' : selectType}{' '}
            </Text>
            <Icons
              name="chevron-down"
              color={selectType === 'All' ? '#000' : '#fff'}
              size={15}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.choice,
              backgroundColor:
                selectRarity === 'All' ? 'white' : COLOR.buttoncolor,
            }}
            onPress={() => setShowRarity(true)}>
            <Text
              style={{
                color: selectRarity === 'All' ? 'black' : 'white',
                fontSize: 15,
              }}>
              {selectRarity === 'All' ? 'Rarity ' : selectRarity}
            </Text>
            <Icons
              name="chevron-down"
              color={selectRarity === 'All' ? '#000' : '#fff'}
              size={15}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.choice,
              backgroundColor: selectSet === 'All' ? '#fff' : COLOR.buttoncolor,
            }}
            onPress={() => setShowSet(true)}>
            <Text
              style={{
                color: selectSet === 'All' ? 'black' : 'white',
                fontSize: 15,
              }}>
              {selectSet === 'All' ? 'Set ' : selectSet}
            </Text>
            <Icons
              name="chevron-down"
              color={selectSet === 'All' ? '#000' : '#fff'}
              size={15}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    // if (!isFetchingMore) return null;
    console.log('Rendering Fotter');
    return (
      <View
        style={{
          paddingVertical: 5,
          marginBottom: 80,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isFetchingNextPage ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (hasNextPage) {
                console.log('Fetching Next Page');
                fetchNextPage();
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icons
              name="search"
              size={20}
              style={{marginRight: 10}}
              color={'#000'}
            />
            <Text style={{color: 'black', fontSize: 18}}>show more</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const RenderCartCard = ({item}) => {
    return (
      <View style={{margin: 15}}>
        <View style={{width: '100%', flex: 1, flexDirection: 'row'}}>
          <Image
            source={{uri: item.image}}
            style={{width: 80, height: 100, borderRadius: 5}}
            resizeMode={'contain'}
          />
          <View style={{flex: 1, marginLeft: 20, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold', fontSize: 20, color: 'black'}}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: 'black'}}>${item.price}</Text>
                <Text> per card</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'red'}}>${item.bqty}</Text>
                  <Text> cards left</Text>
                </View>
              </View>
            </View>
            <View style={{marginLeft: 10, flexDirection: 'column'}}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: COLOR.buttoncolor,
                  }}>
                  {item.qty}
                </Text>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      IncreaseItem(item.id);
                    }}>
                    <Icons
                      name="chevron-up"
                      size={20}
                      color={COLOR.buttoncolor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.qty === 1) {
                        removeCart(item.id);
                      } else {
                        DecreaseItem(item.id);
                      }
                    }}>
                    {item.qty === 1 ? (
                      <Icons name="close" size={20} color={'red'} />
                    ) : (
                      <Icons
                        name="chevron-down"
                        size={20}
                        color={COLOR.buttoncolor}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <Text style={{color: 'black', textAlign: 'right'}}>Price</Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: COLOR.buttoncolor,
                  }}>
                  ${item.totalprice.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderViewCart = () => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cartItems.items}
          renderItem={RenderCartCard}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            padding: 20,
            paddingLeft: 30,
            paddingRight: 30,
            alignItems: 'center',
          }}>
          <View style={{width: '80%'}}>
            <TouchableOpacity onPress={() => dispatch({type: 'clear'})}>
              <Text
                style={{textDecorationLine: 'underline', textAlign: 'center'}}>
                Clear all
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={{color: 'black', fontSize: 18, fontWeight: '600'}}>
                Total cards
              </Text>
              <Text style={{color: 'red', fontWeight: 'bold', fontSize: 18}}>
                {cartItems.items.length}
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '800'}}>
                Total Price
              </Text>
              <Text style={{color: 'red', fontWeight: 'bold', fontSize: 20}}>
                ${ComputeTotalPrice}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{...styles.button, padding: 10}}
            onPress={() => {
              setIsPay(true);
              dispatch({type: 'clear'});
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
              Pay now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{flex: 1}}>
        <Modal
          visible={showCartList}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          transparent
          animationType="fade">
          <View
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'rgba(52, 52, 52, 0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                height: ispay ? '40%' : '70%',
                backgroundColor: 'white',
                borderRadius: 15,
                padding: 10,
                position: 'absolute',
                bottom: 50,
                alignItems: 'center',
              }}>
              {ispay ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icons name="checkmark-circle" size={150} color={'#02d117'} />
                  <Text
                    style={{fontSize: 25, textAlign: 'center', color: 'black'}}>
                    Payment success!
                  </Text>
                </View>
              ) : (
                renderViewCart()
              )}
              <TouchableOpacity
                style={{
                  borderRadius: 15,
                  position: 'absolute',
                  bottom: -30,
                  padding: 10,
                  flexDirection: 'row',
                  backgroundColor: 'red',
                }}
                onPress={() => {
                  setShowCartList(false);
                  setIsPay(false);
                }}>
                <Icons name="close" size={18} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Type Filter Modal  */}
        <CustomModal show={showType} onClose={() => setShowType(false)}>
          <View>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
              Choose type to filter
            </Text>
            <ScrollView>
              <TouchableOpacity
                style={{
                  padding: 5,
                  backgroundColor:
                    selectType === 'All' ? COLOR.buttoncolor : '#f0f0f0',
                  borderColor: COLOR.buttoncolor,
                  borderWidth: 2,
                  margin: 5,
                  borderRadius: 15,
                }}
                onPress={() => {
                  setSelectType('All');
                  setShowType(false);
                }}>
                <Text
                  style={{
                    color: selectType === 'All' ? 'white' : 'black',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  All
                </Text>
              </TouchableOpacity>
              {FilterType.types.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 5,
                    backgroundColor:
                      selectType === item ? COLOR.buttoncolor : '#f0f0f0',
                    borderColor: COLOR.buttoncolor,
                    borderWidth: 2,
                    margin: 5,
                    borderRadius: 15,
                  }}
                  onPress={() => {
                    setSelectType(item);
                    setShowType(false);
                  }}>
                  <Text
                    style={{
                      color: selectType === item ? 'white' : 'black',
                      textAlign: 'center',
                      fontSize: 18,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </CustomModal>
        {/* Rarity Filter Modal */}
        <CustomModal show={showRarity} onClose={() => setShowType(false)}>
          <View>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
              Choose rarity to filter
            </Text>
            <ScrollView>
              <TouchableOpacity
                style={{
                  padding: 5,
                  backgroundColor:
                    selectRarity === 'All' ? COLOR.buttoncolor : '#f0f0f0',
                  borderColor: COLOR.buttoncolor,
                  borderWidth: 2,
                  margin: 5,
                  borderRadius: 15,
                }}
                onPress={() => {
                  setSelectRarity('All');
                  setShowRarity(false);
                }}>
                <Text
                  style={{
                    color: selectRarity === 'All' ? 'white' : 'black',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  All
                </Text>
              </TouchableOpacity>
              {FilterType.rarity.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 5,
                    backgroundColor:
                      selectRarity === item ? COLOR.buttoncolor : '#f0f0f0',
                    borderColor: COLOR.buttoncolor,
                    borderWidth: 2,
                    margin: 5,
                    borderRadius: 15,
                  }}
                  onPress={() => {
                    setSelectRarity(item);
                    setShowRarity(false);
                  }}>
                  <Text
                    style={{
                      color: selectRarity === item ? 'white' : 'black',
                      textAlign: 'center',
                      fontSize: 18,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </CustomModal>

        {/* Set Filter Modal */}
        <CustomModal show={showSet} onClose={() => setShowSet(false)}>
          <View>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
              Choose set name to filter
            </Text>
            <ScrollView>
              <TouchableOpacity
                style={{
                  padding: 5,
                  backgroundColor:
                    selectSet === 'All' ? COLOR.buttoncolor : '#f0f0f0',
                  borderColor: COLOR.buttoncolor,
                  borderWidth: 2,
                  margin: 5,
                  borderRadius: 15,
                }}
                onPress={() => {
                  setSelectSet('All');
                  setShowSet(false);
                }}>
                <Text
                  style={{
                    color: selectSet === 'All' ? 'white' : 'black',
                    textAlign: 'center',
                    fontSize: 18,
                  }}>
                  All
                </Text>
              </TouchableOpacity>
              {FilterType.set.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 5,
                    backgroundColor:
                      selectSet === item ? COLOR.buttoncolor : '#f0f0f0',
                    borderColor: COLOR.buttoncolor,
                    borderWidth: 2,
                    margin: 5,
                    borderRadius: 15,
                  }}
                  onPress={() => {
                    setSelectSet(item);
                    setShowSet(false);
                  }}>
                  <Text
                    style={{
                      color: selectSet === item ? 'white' : 'black',
                      textAlign: 'center',
                      fontSize: 18,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </CustomModal>

        <View
          style={{
            position: 'absolute',
            height: 80,
            backgroundColor: 'white',
            padding: 5,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            zIndex: 1,
          }}>
          <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
            TCG Marketplace
          </Text>
          <Image
            source={IMAGE.header}
            style={{height: 80, width: 120, position: 'absolute', bottom: -25}}
            resizeMode={'contain'}
          />
        </View>

       {status === 'loading'?
       <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator size={50} color={'#000'}/>
        <Text>Loading Cards</Text>
        </View>
       :<ScrollView style={{padding: 20}}>
          {RenderHeader()}
          <FlatList
            data={ShowData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={RenderCard}
            ListFooterComponent={renderFooter}
          />
        </ScrollView>}

        {/* View Cart Button */}
        {cartItems.items.length > 0 ? (
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                ...styles.button,
                maxWidth: 150,
                padding: 10,
                flexDirection: 'row',
              }}
              onPress={() => setShowCartList(true)}>
              <Text
                style={{
                  color: 'white',
                  backgroundColor: 'red',
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'absolute',
                  top: 0,
                  left: -2,
                }}>
                {cartItems.items.length}
              </Text>
              <Icons name="cart" size={18} color={'#fff'} />
              <Text style={{color: 'white', marginLeft: 5}}>View Cart</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </QueryClientProvider>
  );
};

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
});
export default React.memo(Home);
