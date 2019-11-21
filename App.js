import React from 'react';
import { I18nManager, AsyncStorage, Platform } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import AppNavigator from './src/routes';
import { Root } from "native-base";
import './ReactotronConfig';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import { Notifications } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };

    // I18nManager.forceRTL(true)
    // AsyncStorage.clear();
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('orders', {
        name: 'Chat messages',
        sound: true,
      });
    }

    Notifications.addListener(this.handleNotification);

    await Font.loadAsync({
      cairo: require('./assets/fonts/Cairo-Regular.ttf'),
      cairoBold: require('./assets/fonts/Cairo-Bold.ttf'),
      openSansBold: require('./assets/fonts/OpenSans-Bold.ttf'),
      openSans: require('./assets/fonts/OpenSans-Regular.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({isReady: true});
  }

  handleNotification = (notification) => {
    if (notification && notification.origin !== 'received') {
      this.props.navigation.navigate('notifications');
    }
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
        <Provider store={store}>
          <PersistGate persistor={persistedStore}>
            <Root>
              <AppNavigator />
            </Root>
          </PersistGate>
        </Provider>
    );
  }
}

