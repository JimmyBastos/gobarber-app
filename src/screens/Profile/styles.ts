import styled from 'styled-components/native'
import { Platform } from 'react-native'

export const Container = styled.View`
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  /* increase touchable area */
  border: solid 16px transparent;
  left: 8px;
  top: 48px;
  z-index: 1;
`

export const UserAvatarUpload = styled.TouchableOpacity`

`

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  margin-top: 64px;
  align-self: center;
`
