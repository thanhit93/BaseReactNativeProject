import { Dimensions , PixelRatio} from "react-native";

export function widthPercentageToDP(widthPercent: string): number {
    const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100)
}

export function heightPercentageToDP(heightPercent: string): number {
    const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
}

export function heightDP(height: number): number {
    const elemHeight = height / 928;
    const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight)
}