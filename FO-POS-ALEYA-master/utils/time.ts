import dayjs from 'dayjs'

const UTC_OFFSET = 7

export const format = (
  dateString: string,
  template: string = 'D MMMM YYYY, HH.mm'
) => {
  return dayjs.utc(dateString).utcOffset(UTC_OFFSET).format(template)
}
