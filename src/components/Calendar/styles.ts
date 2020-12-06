import styled, { css } from 'styled-components/native'

import { RectButton } from 'react-native-gesture-handler'

interface DayContainerProps {
  isDisabled: boolean
  isSelected?: boolean
}

interface DayProps {
  isToday: boolean
  isDisabled: boolean
  isSelected: boolean
}

export const Container = styled.View`
`

export const DayContainer = styled.View<DayContainerProps>`
  background: #3e3b47;

  width: 40px;
  height: 40px;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;


  ${props => props.isDisabled && css`
    background: transparent;
  `}

  ${props => props.isSelected && css`
    background: #ff9000;
  `}

`

export const DayText = styled.Text<DayProps>`
  color: #f4ede8;

  ${props => props.isToday && css`
    color: #ff9000;
  `}

  ${props => props.isDisabled && css`
    color: #666360;
  `}

  ${props => props.isSelected && css`
    color: #232129;
  `}
`
