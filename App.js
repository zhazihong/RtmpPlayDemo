/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import RTMPPlay from "./src/RtmpPlay";

const App: () => React$Node = () => {
    return (
        <View style={{flex:1}}>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <RTMPPlay/>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({});

export default App;
