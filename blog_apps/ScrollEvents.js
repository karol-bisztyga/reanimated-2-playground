import React from 'react';
import {View, StyleSheet, Platform, Dimensions, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  scrollTo,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';

const NUMBER_OF_ITEMS = 30;
const BOX_WIDTH = 40;
const BOX_HEIGHT = 60;
const windowHeight = Dimensions.get('window').height;

const LeftScroll = ({
  animatedRef,
  layoutHeight,
  contentHeight,
  translation,
}) => {
  const performScroll = (eventValue) => {
    'worklet';
    translation.value = Math.min(
      Math.max(eventValue, 0),
      layoutHeight.value - BOX_HEIGHT,
    );
    const scr =
      (translation.value * contentHeight.value) /
      (layoutHeight.value - BOX_HEIGHT);
    scrollTo(animatedRef, 0, scr, false);
  };

  const panHandler = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      ctx.start = e.y - BOX_HEIGHT / 2;
    },
    onActive: (e, ctx) => {
      performScroll(e.translationY + ctx.start);
    },
  });

  const tapHandler = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      if (e.y > 0) {
        performScroll(e.y - BOX_HEIGHT / 2);
      }
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translation.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View>
        <TapGestureHandler onGestureEvent={tapHandler}>
          <Animated.View style={styles.left}>
            <Animated.View style={[styles.box, animatedStyles]} />
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const RightScroll = ({
  animatedRef,
  layoutHeight,
  contentHeight,
  translation,
}) => {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translation.value =
        (event.contentOffset.y /
          (event.contentSize.height - event.layoutMeasurement.height)) *
        (event.layoutMeasurement.height - BOX_HEIGHT);
    },
  });

  return (
    <View style={styles.right}>
      <Animated.ScrollView
        ref={animatedRef}
        style={styles.scroll}
        scrollEventThrottle={1}
        onScroll={scrollHandler}
        onContentSizeChange={(width, height) => {
          contentHeight.value = height - layoutHeight.value;
        }}>
        {Array.from({length: NUMBER_OF_ITEMS}).map((_, i) => (
          <View key={i} style={styles.item}>
            <Text>{`item ${i}`}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

function ScrollExample() {
  const animatedRef = useAnimatedRef();
  const translation = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const layoutHeight = useSharedValue(windowHeight);

  return (
    <View style={styles.container}>
      <LeftScroll
        animatedRef={animatedRef}
        translation={translation}
        contentHeight={contentHeight}
        layoutHeight={layoutHeight}
      />
      <RightScroll
        animatedRef={animatedRef}
        translation={translation}
        contentHeight={contentHeight}
        layoutHeight={layoutHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    height: Platform.OS === 'web' ? windowHeight : undefined,
    overflow: 'hidden',
  },
  right: {
    flex: 8,
    height: Platform.OS === 'web' ? windowHeight : undefined,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#EBEDEF',
  },
  box: {
    alignSelf: 'center',
    backgroundColor: '#D4E6F1',
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
  },
  item: {
    borderWidth: 1,
    borderColor: '#AEB6BF',
    padding: 20,
    height: BOX_HEIGHT,
  },
});

export default ScrollExample;
