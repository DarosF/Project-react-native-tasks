
import {AppRegistry} from 'react-native';
import Navigator from './src/Navigator';
import {name as appName} from './app.json';

require('RCTNativeAppEventEmitter');

AppRegistry.registerComponent(appName, () => Navigator); //primeira chamada de tela
