import {createBrowserApp} from '@react-navigation/web';
import React from 'react';
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {RectButton, ScrollView} from 'react-native-gesture-handler';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Events from './blog_apps/events/Events';
import ScrollEvents from './blog_apps/scroll_events/ScrollEvents';
import {One, Two, Three} from './blog_apps/scroll_events/snippets';

const SCREENS = {
  Events: {
    screen: Events,
    title: '🆕 Events',
  },
  ScrollEvents: {
    screen: ScrollEvents,
    title: '🆕 Scroll Events',
  },
  One: {
    screen: One,
    title: '🆕 Scroll Events - snippet One',
  },
  Two: {
    screen: Two,
    title: '🆕 Scroll Events - snippet Two',
  },
  Three: {
    screen: Three,
    title: '🆕 Scroll Events - snippet Three',
  },
};

function MainScreen({navigation}) {
  const data = Object.keys(SCREENS).map((key) => ({key}));
  return (
    <FlatList
      style={styles.list}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={(props) => (
        <MainScreenItem
          {...props}
          screens={SCREENS}
          onPressItem={({key}) => navigation.navigate(key)}
        />
      )}
      renderScrollComponent={(props) => <ScrollView {...props} />}
    />
  );
}

MainScreen.navigationOptions = {
  title: '🎬 Blog examples',
};

export function ItemSeparator() {
  return <View style={styles.separator} />;
}

export function MainScreenItem({item, onPressItem, screens}) {
  const {key} = item;
  return (
    <RectButton style={styles.button} onPress={() => onPressItem(item)}>
      <Text style={styles.buttonText}>{screens[key].title || key}</Text>
    </RectButton>
  );
}

const BlogExamples = createStackNavigator(
  {
    Main: {screen: MainScreen},
    ...SCREENS,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
  },
);

const ExampleApp = createSwitchNavigator({
  BlogExamples,
});

export const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const createApp = Platform.select({
  web: (input) => createBrowserApp(input, {history: 'hash'}),
  default: (input) => createAppContainer(input),
});

export default createApp(ExampleApp);
