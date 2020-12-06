import styled from 'styled-components/native'

import Button from '../../components/Button'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`

export const Title = styled.Text`
  margin-top: 48px;

  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 32px;
  text-align: center;
`

export const Description = styled.Text`
  margin-top: 16px;

  font-family: 'RobotoSlab-Regular';
  color: #999591;
  font-size: 18px;
  text-align: center;
`

export const OkButton = styled(Button)`
  margin-top: 24px;
  min-width: 90px;
`
