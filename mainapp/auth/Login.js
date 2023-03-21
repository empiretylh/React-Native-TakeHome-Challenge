/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Button,
  ActivityIndicator, 
  TouchableOpacity,
} from 'react-native';
import {COLOR,IMAGE} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import {MessageModalNormal} from '../extra/CustomModal';
import { AuthContext } from '../context/context';

const Login = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const {token, setToken} = useContext(AuthContext);

  return (
    <ScrollView>
      <MessageModalNormal show={load} width={'20%'}>
        <ActivityIndicator size={'large'} color={'#000'} />
        <Text style={{color: '#000', textAlign: 'center'}}>Loging</Text>
      </MessageModalNormal>
      <View
        style={{alignItems: 'center', justifyContent: 'center', padding: 30}}>
        <Image source={IMAGE.app_logo} style={{width:200,height:200}} resizeMode={'contain'}/>
        <Text style={{color: '#000', fontSize: 20, fontWeight: 'bold'}}>
         Pokemon TCG
        </Text>
        <Text style={{color:'#000', fontSize: 15}}>Created by Thura Lin Htut</Text>
       </View>
      <View style={{padding: 10}}>
        <Text style={{color: 'black'}}>Username</Text>
        <TextInput
         style={styles.textinput}
          placeholder={'Username'}
          onChangeText={e => {
            setUsername(e);
          }}
          autoComplete={'username'}
        />
        <Text style={{color: 'black'}}>Password</Text>
        <View
          style={{
            ...styles.textinput,
            flexDirection: 'row',
            padding: 0,
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              backgroundColor: COLOR.textfield,
              flex: 1,
              ...styles.textinput,
              padding: 10,
            }}
            placeholder={'Password'}
            autoComplete={'password'}
            secureTextEntry={visible}
            onChangeText={e => setPassword(e)}
          />
          <Icon
            name={visible ? 'eye' : 'eye-off'}
            size={25}
            color={'#000'}
            style={{padding: 5}}
            onPress={() => setVisible(!visible)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (username && password) {
              setLoad(true);
             setToken(true);
            } else {
              alert('Please Require Fills');
            }
          }}>
          <Text style={{color: 'white',fontWeight:'bold',fontSize:18}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setToken(true);
          }}>
          <Text style={{color: 'white',fontWeight:'bold',fontSize:18}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textinput: {
    backgroundColor: COLOR.textfield,
    color: 'black',
    borderRadius: 15,
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: COLOR.buttoncolor,
    padding: 15,
    color: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
});

export default Login;
