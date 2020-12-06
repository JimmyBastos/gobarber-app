import React, { useCallback, useMemo, useState } from 'react'

import { eachWeekendOfMonth, format as formatDate } from 'date-fns'

import {
  Calendar as RNCalendar,
  DateObject,
  LocaleConfig,
  CalendarProps as RNCalendarProps,
  DotMarking
} from 'react-native-calendars'

import {
  Container
} from './styles'
import nextWeekday from '../../utils/nextWeekday'

LocaleConfig.locales.pt_BR = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S.', 'S']
}

LocaleConfig.defaultLocale = 'pt_BR'

interface CalendarProps {
  onDateChange?: (date: Date) => void
  markedDates?: DotMarking
  enableWeekends?: boolean
  containerStyle?: object
}

const Calendar: React.FC<CalendarProps & RNCalendarProps> = ({ onDateChange, markedDates = { }, enableWeekends = false, containerStyle, ...props }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => {
      return enableWeekends ? new Date() : nextWeekday(new Date())
    }
  )
  const [year, setYear] = useState((new Date()).getFullYear())

  const disabledWeekends : DotMarking = useMemo(
    () => {
      const monthList = [...Array(12).keys()].map(
        (month) => new Date(year, month, 1)
      )

      return enableWeekends ? {} : monthList.reduce((weekends, monthDate) => {
        return Object.assign(weekends,
          eachWeekendOfMonth(monthDate)
            .reduce(
              (dateList, date) => {
                dateList[formatDate(date, 'yyyy-MM-dd')] = { disabled: true }
                return dateList
              }, {}
            )
        )
      }, {})
    }, [enableWeekends, year]
  )

  const calendarDateConfig = useMemo(
    () => {
      return { ...disabledWeekends, ...markedDates } as DotMarking
    }, [disabledWeekends, markedDates]
  )

  const currentDateFormated = useMemo(
    () => formatDate(new Date(), 'yyyy-MM-dd'), []
  )

  const selectedDateFormated = useMemo(
    () => formatDate(selectedDate, 'yyyy-MM-dd'), [selectedDate]
  )

  const handleDateSelection = useCallback(
    (date: DateObject) => {
      const isDisabledDate = calendarDateConfig[date.dateString]?.disabled

      if (isDisabledDate) return

      const newSelectedDate = new Date(date.dateString)

      setSelectedDate(newSelectedDate)
      onDateChange(newSelectedDate)
    }, [calendarDateConfig, onDateChange]
  )

  const handleMonthChange = useCallback(
    (date: DateObject) => {
      setYear(date.year)
    }, [])

  return (
    <Container
      style={containerStyle}
    >
      <RNCalendar
        hideExtraDays={true}
        markedDates={{ ...calendarDateConfig, [selectedDateFormated]: { selected: true } }}
        onDayPress={handleDateSelection}
        onMonthChange={handleMonthChange}
        minDate={currentDateFormated}
        style={{ borderRadius: 10 }}
        theme={{
          backgroundColor: '#28262e',
          calendarBackground: '#28262e',
          textSectionTitleColor: '#f4ede8',
          selectedDayBackgroundColor: '#ff9000',
          selectedDayTextColor: '#232129',
          todayTextColor: '#f4ede8',
          dayTextColor: '#f4ede8',
          textDisabledColor: '#666360',
          dotColor: '#ff9000',
          selectedDotColor: '#232129',
          arrowColor: 'orange',
          monthTextColor: '#f4ede8',
          indicatorColor: '#ff9000',
          textDayFontFamily: 'RobotoSlab-Medium',
          textMonthFontFamily: 'RobotoSlab-Medium',
          textDayHeaderFontFamily: 'RobotoSlab-Medium',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '100',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14
        }}
        {...props}
      />
    </Container>
  )
}

export default Calendar
