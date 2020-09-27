import React from 'react';
import {View, StyleSheet, Dimensions, Button} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  scrollTo,
  runOnUI,
} from 'react-native-reanimated';

const NUMBER_OF_ITEMS = 20;
const ITEM_SIZE = {
  size: 120,
  margin: 70,
};

function ScrollExample() {
  const position = useSharedValue(0);
  const scrollWidth = useSharedValue(0);
  const animatedRef = useAnimatedRef();

  const itemTotalSize = ITEM_SIZE.size + ITEM_SIZE.margin * 2;
  const screenWidth = Dimensions.get('window').width;
  const borderMargin = screenWidth / 2 - itemTotalSize / 2 + ITEM_SIZE.margin;

  const scrollToNearestItem = (offset) => {
    'worklet';
    let minDistance;
    let minDistanceIndex = 0;
    for (let i = 0; i < NUMBER_OF_ITEMS; ++i) {
      const distance = Math.abs(i * itemTotalSize - offset);
      if (minDistance === undefined) {
        minDistance = distance;
      } else {
        if (distance < minDistance) {
          minDistance = distance;
          minDistanceIndex = i;
        }
      }
    }

    scrollTo(animatedRef, minDistanceIndex * itemTotalSize, 0, true);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e, ctx) => {
      position.value = e.contentOffset.x;
      //console.log('scroll', position.value);
    },
    onEndDrag: (e, ctx) => {
      scrollToNearestItem(e.contentOffset.x);
    },
    onMomentumEnd: (e, ctx) => {
      scrollToNearestItem(e.contentOffset.x);
    },
  });

  // buttons logic
  const buttons = [
    {
      title: '<<',
      callback: () => {
        runOnUI(() => {
          'worklet';
          scrollTo(animatedRef, 0, 0, true);
        })();
      },
    },
    {
      title: '<',
      callback: () => {
        runOnUI(() => {
          'worklet';
          scrollTo(animatedRef, position.value - itemTotalSize, 0, true);
        })();
      },
    },
    {
      title: '>',
      callback: () => {
        runOnUI(() => {
          'worklet';
          scrollTo(animatedRef, position.value + itemTotalSize, 0, true);
        })();
      },
    },
    {
      title: '>>',
      callback: () => {
        // scroll to last
        runOnUI(() => {
          'worklet';
          scrollTo(animatedRef, Infinity, 0, true);
        })();
      },
    },
  ];

  return (
    <View>
      <Animated.ScrollView
        ref={animatedRef}
        horizontal={true}
        style={styles.scroll}
        scrollEventThrottle={1}
        onScroll={scrollHandler}
        onContentSizeChange={(width, height) => {
          scrollWidth.value = width;
        }}>
        {Array.from({length: NUMBER_OF_ITEMS}).map((_, i) => {
          const uas = useAnimatedStyle(() => {
            const style = {};
            const relativeDistance = position.value - i * itemTotalSize;
            const distance = Math.abs(relativeDistance);
            const itemDistance = distance / itemTotalSize;
            let opacity;
            const translateY = itemTotalSize * itemDistance;
            let rotateZ = itemDistance * 2;
            rotateZ = relativeDistance > 0 ? -rotateZ : rotateZ;
            if (itemDistance < 0.5) {
              opacity = 1;
            } else if (itemDistance >= 0.5 && itemDistance <= 2) {
              opacity = 0.3;
            } else {
              opacity = 0;
            }
            style.opacity = opacity;
            //console.log('distance', distance, itemTotalSize, itemDistance);
            if (i === 0) {
              style.marginLeft = borderMargin;
            } else if (i === NUMBER_OF_ITEMS - 1) {
              style.marginRight = borderMargin;
            }
            style.transform = [{translateY}, {rotateZ}];
            return style;
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.item,
                {backgroundColor: i % 2 ? 'purple' : 'orange'},
                uas,
              ]}
            />
          );
        })}
      </Animated.ScrollView>

      <View style={styles.buttonWrapper}>
        {buttons.map(({title, callback}) => {
          return (
            <View style={styles.button}>
              <Button title={title} onPress={callback} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: ITEM_SIZE.size,
    height: ITEM_SIZE.size,
    margin: ITEM_SIZE.margin,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
});

export default ScrollExample;
