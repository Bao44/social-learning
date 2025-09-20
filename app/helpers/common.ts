import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const hp = (percentage: any) => {
  return (percentage * deviceHeight) / 100;
};

export const wp = (percentage: any) => {
  return (percentage * deviceWidth) / 100;
};

export const stripHtmlTags = (html: any) => {
  return html.replace(/<[^>]*>?/gm, '');
};
