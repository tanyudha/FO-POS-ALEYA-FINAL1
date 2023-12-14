import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/id'

dayjs.locale('id')
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
