import React, { useCallback, useMemo } from 'react'

import { format as formatDate } from 'date-fns'
import { useNavigation, useRoute } from '@react-navigation/native'

import {
  Container,
  Title,
  Description,
  OkButton
} from './styles'

import Icon from 'react-native-vector-icons/Feather'

interface RouteParams {
  time: number
}

const AppointmentCreated: React.FC = () => {
  const route = useRoute()
  const { reset } = useNavigation()

  const { time } = route.params as RouteParams

  const formattedDate = useMemo(
    () => {
      const appointmentDate = new Date(time)

      const format = "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' H:mm'h'"

      const appointmentDateFormatted = formatDate(
        appointmentDate,
        format,
        { locale: require('date-fns/locale/pt-BR') }
      )

      return appointmentDateFormatted
    }, [time]
  )

  const handleOkPressed = useCallback(
    () => {
      reset({
        index: 0,
        routes: [{ name: 'Dashboard' }]
      })
    }, [reset]
  )

  return (
    <Container>
      <Icon
        name="check"
        size={80}
        color="#04d361"/>

      <Title>
        Agendamento Concluído
      </Title>

      <Description>
        {formattedDate}
      </Description>

      <OkButton onPress={handleOkPressed}>
        Ok
      </OkButton>
    </Container>
  )
}

export default AppointmentCreated
