/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import   TabBar from './app/component/TabBar';

export default class ala extends Component {
  render() {
    return (
        <TabBar/>
    );
  }
}



AppRegistry.registerComponent('ala', () => ala);
