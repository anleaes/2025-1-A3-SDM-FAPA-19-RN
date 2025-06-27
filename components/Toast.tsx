import Toast from 'react-native-toast-message';

export const showToast = (type: string, text1: string, text2?: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    text1Style: {
      fontSize: 16
    },
    text2Style: {
      fontSize: 14
    },
    topOffset: 30,
    bottomOffset: 40,
  });
};