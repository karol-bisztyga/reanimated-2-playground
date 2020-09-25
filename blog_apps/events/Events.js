import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';

const ballSize = 100;
const startX = Dimensions.get('window').width / 2 - ballSize / 2;
const startY = 20;

export default function AnimatedStyleUpdateExample() {
  const pressed = useSharedValue(false);
  const x = useSharedValue(startX);
  const y = useSharedValue(startY);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
    },
  });

  const tapHandler = useAnimatedGestureHandler({
    onActive: (event, ctx) => {
      x.value = withSpring(startX);
      y.value = withSpring(startY);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [{translateX: x.value}, {translateY: y.value}],
    };
  });
  return (
    <View style={{flex: 1}}>
      <TapGestureHandler onGestureEvent={tapHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={eventHandler}>
            <Animated.View style={[styles.ball, uas]} />
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}
const styles = StyleSheet.create({
  ball: {
    width: ballSize,
    height: ballSize,
    backgroundColor: 'orange',
    borderRadius: ballSize / 2,
  },
  container: {
    position: 'absolute',
    padding: 20,
    justifyContent: 'space-between',
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 1,
  },
  text: {
    color: 'green',
    fontSize: 130,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    opacity: 0.04,
  },
});
