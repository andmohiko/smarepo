import dayjs from 'dayjs'

/**
 * その月の最終日を取得する
 * @param year
 * @param month
 */
export const getLastDay = (year: number, month: number): number => {
  const zeroPaddingMonth = `0${month}`.slice(-2)
  const yearMonth = new Date(`${year}-${zeroPaddingMonth}`)
  return dayjs(yearMonth).endOf('month').date() + 1
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
