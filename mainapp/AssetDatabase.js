import {Dimensions, StyleSheet, Alert} from 'react-native';

export const COLOR = {
  black: '#000000',
  white: '#ffffff',
  textfield: '#D9D9D9',
  buttoncolor:'#0075FF',
  green: '#01964E',
  dividerColor: '#D9D9D9',
  dsibleColor: '#B0A2A2',
  bgColor: '#f1f1f1',
  deleteColor: '#FF3D00',
  redColor: '#FF0000',
  windowWidth: Dimensions.get('window').width / 100,
  windowHeight: Dimensions.get('window').height / 100,
};
export const IMAGE = {
  loadgif: require('./assets/spinnerloading.gif'),
  app_logo: require('./assets/icon.png'),
};

