
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Input } from "reactstrap";
import 'react-datepicker/dist/react-datepicker.css'

import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
dayjs.locale('th') 
dayjs.extend(buddhistEra)

const CustomInput = ({ value, onClick, placeholderName }) => {
  let thaiDate = ''
  if (value !== '') {
    const date = dayjs(value)
    thaiDate = `${date.year() + 543}${date.format('-MM-DD')}`
  }
  return (
    <Input value={thaiDate} onClick={onClick} placeholder={placeholderName} />
  )
}

const CustomInputWrapper = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <CustomInput {...props} />
  </div>
))

const headerStyle = {
  margin: 10,
  display: 'flex',
  justifyContent: 'space-between'
}

export const range = (startVal = 0, endVal = 0, increment = 0) => {
  let list = []
  if (increment <= 0) {
    return list
  }
  for (let index = startVal; index < endVal; index = index + increment) {
    list = [...list, index]
  }
  return list
}

export const WatDatePicker = (props) => {
  const [value, setValue] = useState(
    props.value ? props.value : dayjs().format('YYYY-MM-DD')
  )
  const [selectedDate, setSelectedDate] = useState(new Date(value))
  const thisYear = dayjs().year()
  const years = range(thisYear - 20, thisYear + 20, 1)
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ]
  const highlightWithRanges = [
    {
      'react-datepicker__day--highlighted-today': [new Date()]
    }
  ]
  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled
      }) => (
        <div style={headerStyle}>
          <button
            className='borderless'
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            
            <i className="fas fa-chevron-left"></i>
          </button>

          <select
            className='borderless'
            value={months[dayjs(date).month()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className='borderless'
            value={dayjs(date).year()}
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option + 543}
              </option>
            ))}
          </select>

          <button
            className='borderless'
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          >
             <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      minDate={props.minDate ? new Date(props.minDate) : null}
      maxDate={props.maxDate ? new Date(props.maxDate) : null}
      dateFormat={props.dateFormat ? props.dateFormat : 'yyyy-MM-dd'}
      selected={selectedDate}
      onChange={(date) => {
        // console.log(date)
        setSelectedDate(date)
        setValue(dayjs(date).format('YYYY-MM-DD'))
        const thaiDate = date
          ? `${dayjs(date).format('BBBB-MM-DD')}`
          : ''
        props.onChange(dayjs(date).format('YYYY-MM-DD'), thaiDate)

      }}
      highlightDates={highlightWithRanges}
      customInput={<CustomInputWrapper placeholderName={props.placeholder} />}
    />
  )
}