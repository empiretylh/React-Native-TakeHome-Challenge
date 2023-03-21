import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

export const MessageModalNormal = ({
  show,
  children,
  onClose,
  width,
  nobackExit,
  radius = 15,
  backgroundColor = 'white',
  height,
}) => {
  // const backAction = () => {
  //   console.log('What');

  //   return true;
  // };

  return (
    <Modal
      visible={show}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transparent
      animationType="fade"
      onRequestClose={() => (nobackExit ? Alert.alert('Exit','Are you sure want to exit ?',[{titile:'OK'}]) : onClose())}
    >
      <View
        style={{
          flex: 1,

          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',

          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width ? width : '80%',
            height: height ? height : height,
            backgroundColor: backgroundColor,
            borderRadius: radius,
            padding: 10,
          }}>
          {children}
        </View>
      </View>
    </Modal>
  );
};
