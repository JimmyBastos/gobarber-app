import { FlatList, RectButton } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'
import { Provider } from '.'

interface ProviderContainerProps {
  isSelected: boolean
}

interface HourProps {
  isAvailable: boolean
  isSelected: boolean
}

interface HourTextProps {
  isSelected: boolean
}

export const Container = styled.View`
  flex: 1;
`

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background-color: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BackButton = styled(RectButton)`
`

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  margin-left: 16px;
`

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 56px;
  margin-left: auto;
`

export const ProvidersListContainer = styled.View`
  height: 112px;
`

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px;
`

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${props => props.isSelected ? '#ff9000' : '#3e3b47'};
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  margin-right: 16px;
  border-radius: 10px;
`

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`

export const ProviderName = styled.Text<ProviderContainerProps>`
  color: ${props => props.isSelected ? '#232129' : '#f4ede8'};
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
`

export const DayPicker = styled.View`
  margin-bottom: 32px;
`

export const Schedule = styled.View`
  margin-bottom: 32px;
`

export const Title = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  margin-bottom: 24px;
  padding: 0 24px;
`

export const Section = styled.View`
  margin-bottom: 24px;
`

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin-bottom: 12px;
  padding: 0 24px;
`

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  showsHorizontalScrollIndicator: false,
  horizontal: true
})`

`

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  border-radius: 10px;
  margin-right: 8px;

  opacity: ${(props) => props.isAvailable ? 1 : 0.3};

  background: ${props => props.isSelected ? '#ff9000' : '#3e3b47'};

`

export const HourText = styled.Text<HourTextProps>`
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';

  color: ${props => props.isSelected ? '#232129' : '#f4ede8'};
`

export const ScheduleButtonContainer = styled.View`
  padding: 24px;
`
