import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window")

export const hp = (precentage) => {
    return (precentage * deviceHeight) / 100
}

export const wp = (precentage) => {
    return (precentage * deviceWidth) / 100
}