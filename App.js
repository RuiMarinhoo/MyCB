/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import MyCalendar from './app/components/calendar/calendar';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


export default class App extends Component {

  async getInstanceId() {
    const token = await iid().getToken();
    // console.log(token);

    database()
        .ref('users')
        .on("value", snapshot => {
          snapshot.forEach( user => {
            if ( user.child('username').val() === 'Rita') {
              console.log(user.child('fbID').val());
            }

          });
    });

    // database()
    //     .ref('users')
    //     .push({username: 'Rui', password: 'abc', fbID: token})

    // database()
    //     .ref('users')
    //     .on('value', snapshot => {
    //       console.log('User data: ', snapshot.val());
    //     });
  }


  render() {
    this.getInstanceId();
    return (
        <>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
              {global.HermesInternal == null ? null : (
                  <View style={styles.engine}>
                    <Text style={styles.footer}>Engine: Hermes</Text>
                  </View>
              )}
              <View style={styles.body}>
                <View>
                  <MyCalendar/>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>teste</Text>
                  <Text style={styles.sectionDescription}>
                    <ReloadInstructions />
                  </Text>
                </View>


              </View>
            </ScrollView>
          </SafeAreaView>
        </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
