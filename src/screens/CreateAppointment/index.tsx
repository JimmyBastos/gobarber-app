import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Calendar from '../../components/Calendar'

import Icon from 'react-native-vector-icons/Feather'

import { format as formatDate } from 'date-fns'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

import api from '../../services/api'

import { Alert, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import Button from '../../components/Button'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  DayPicker,
  Schedule,
  Title,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  ScheduleButtonContainer
} from './styles'

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface Availability {
  hour: number
  available: boolean
  hourFormatted?: string
}

const CreatedAppointment: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const goBack = useCallback(navigation.goBack, [navigation])

  const { providerId } = route.params as RouteParams

  const { user } = useAuth()

  const [providers, setProviders] = useState<Provider[]>([])

  const [availability, setAvailability] = useState<Availability[]>([])

  const [selectedDate, setSelectedDate] = useState(new Date())

  const [selectedHour, setSelectedHour] = useState<number | null>()

  const [selectedProviderId, setSelectedProviderId] = useState(providerId)

  const handleSelectProvider = useCallback(
    (id: string) => {
      setSelectedHour(null)
      setSelectedProviderId(id)
    }, []
  )

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date)
      setSelectedHour(null)
    }, []
  )

  const handleSelectHour = useCallback(
    (hour: number) => {
      setSelectedHour(hour)
    }, []
  )

  const handleCreateAppointment = useCallback(
    async () => {
      try {
        const date = new Date(selectedDate)

        date.setHours(selectedHour)
        date.setMinutes(0)

        await api.post('appointments', {
          provider_id: selectedProviderId,
          date: formatDate(date, 'yyyy-MM-dd HH:mm')
        })

        navigation.navigate('AppointmentCreated', { time: date.getTime() })
      } catch (error) {
        Alert.alert(
          'Erro ao criar agendamento',
          'Ocorreu um erro ao tentar criar o agendamento, tente novamente.'
        )
      }
    }, [navigation, selectedDate, selectedHour, selectedProviderId]
  )

  useEffect(
    function loadProviders () {
      api.get<Provider[]>('/providers').then(({ data }) => {
        setProviders(data)
      })
    }, []
  )

  useEffect(
    function loadAvailability () {
      const params = {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }

      api.get<Availability[]>(`/providers/${selectedProviderId}/day-availability`, { params })
        .then(({ data }) => {
          data = data.map(({ hour, available }) => {
            return {
              hour,
              available,
              hourFormatted: formatDate((new Date()).setHours(hour), 'HH:00')
            }
          })

          setAvailability(data)
        })
    }, [selectedProviderId, selectedDate]
  )

  const morningAvalilability = useMemo(
    () => availability.filter(({ hour }) => hour < 12), [availability]
  )

  const afternoonAvalilability = useMemo(
    () => availability.filter(({ hour }) => hour >= 12), [availability]
  )

  return (
    <Container>
      <Header>
        <BackButton onPress={goBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 112 }} >
          <ProvidersList
            data={providers}
            keyExtractor={(provider, idx) => provider.id + idx}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                isSelected={provider.id === selectedProviderId}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />

                <ProviderName isSelected={provider.id === selectedProviderId}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </View>

        <DayPicker>
          <Title>
            Escolha a data
          </Title>
          <Calendar
            containerStyle={{ paddingHorizontal: 24 }}
            onDateChange={handleDateChange}
          />
        </DayPicker>

        <Schedule>
          <Title>
            Escolha a hora
          </Title>

          <Section>
            <SectionTitle>
              Manhã
            </SectionTitle>
            <SectionContent>
              {morningAvalilability.map(
                ({ available, hour, hourFormatted }) => (
                  <Hour
                    key={hourFormatted + available}
                    enabled={available}
                    isAvailable={available}
                    isSelected={hour === selectedHour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText isSelected={hour === selectedHour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                )
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>
              Tarde
            </SectionTitle>
            <SectionContent>
              {afternoonAvalilability.map(
                ({ available, hour, hourFormatted }) => (
                  <Hour
                    key={hourFormatted + available}
                    enabled={available}
                    isAvailable={available}
                    isSelected={hour === selectedHour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText isSelected={hour === selectedHour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                )
              )}
            </SectionContent>
          </Section>

          <ScheduleButtonContainer>
            <Button
              enabled={!!selectedDate && !!selectedHour}
              onPress={handleCreateAppointment}
            >
              Agendar
            </Button>
          </ScheduleButtonContainer>
        </Schedule>
      </ScrollView>
    </Container>
  )
}
export default CreatedAppointment
