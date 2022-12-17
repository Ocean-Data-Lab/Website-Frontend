import React from 'react'
import { DatePicker } from 'antd'
import { Box, styled } from '@mui/system'
import * as moment from 'moment'

const DateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    marginBottom: '-10px',
    flexDirection: 'column',
    position: 'relative',
}))

const { RangePicker } = DatePicker

const DialogDatePicker = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    selectedValue,
}) => {
    const disabledDate = (current) => {
        if (selectedValue === 'CTD') {
            return (
                current &&
                (current < moment.utc([2015, 0, 1]) ||
                    current > moment.utc([2022, 0, 2]))
            )
        } else if (selectedValue === 'Mete') {
            return (
                current &&
                (current < moment.utc([2020, 1, 1]) ||
                    current > moment.utc([2022, 11, 31]))
            )
        }
        return (
            current &&
            (current < moment.utc([2015, 0, 14]) ||
                current > moment.utc([2020, 11, 31]))
        )
    }

    const handleCalendarChange = (dates, dateStrings, info) => {
        if (
            dateStrings[1] === '' ||
            (dateStrings[0] !== startDate && dateStrings[1] === endDate)
        ) {
            const futureMonth = moment(dateStrings[0])
                .add(1, 'M')
                .add(23, 'hours')
            const next = moment(futureMonth._d)

            setStartDate(dateStrings[0])
            setEndDate(next.format('YYYY-MM-DD HH'))
        } else {
            setStartDate(dateStrings[0])

            const futureMonth = moment(dateStrings[1]).add(23, 'hours')
            const next = moment(futureMonth._d)
            setEndDate(next.format('YYYY-MM-DD HH'))
            // setEndDate(dateStrings[1])
        }
    }

    return (
        <DateBox style={{ width: '100%' }}>
            <RangePicker
                size="large"
                // disabled={selectedValue === 'Spec' ? [false, false] : [true, true]}
                showTime={{
                    hideDisabledOptions: true,
                }}
                defaultValue={[moment(startDate), moment(endDate)]}
                value={[moment(startDate), moment(endDate)]}
                format={
                    selectedValue === 'Spec' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD'
                }
                onCalendarChange={handleCalendarChange}
                disabledDate={disabledDate}
                allowClear={false}
            />
        </DateBox>
    )
}

export default DialogDatePicker
