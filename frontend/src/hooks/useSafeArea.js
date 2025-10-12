import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();

  return {
    safeAreaStyle: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    insets
  };
};