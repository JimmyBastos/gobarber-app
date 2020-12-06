import { addDays } from 'date-fns'

export default function nextWeekday (date: number | Date) : Date {
  const weekday = new Date(date)

  switch (weekday.getDay()) {
    case 0: return addDays(weekday, 1)
    case 6: return addDays(weekday, 2)
    default: return weekday
  }
}
