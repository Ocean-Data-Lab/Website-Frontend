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

const SpecDatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 14]) ||
                current > moment.utc([2023, 12, 31]))
        )
    }

    const handleCalendarChange = (dates, dateStrings, info) => {
        // Set start date
        setStartDate(dateStrings[0])

        // If first item in dateStrings is different from startDate
        if (dateStrings[0] !== startDate) {
            // Add 1 month to end date
            const futureMonth = moment(dateStrings[1]).add(1, 'M').add(24, 'H').add(60, 'minute')
            // Set end date
            setEndDate(futureMonth.format('YYYY-MM-DD HH:mm'))
        }
        // If second item in dateStrings is different from endDate
        else if (dateStrings[1] !== endDate) {
            // Set end date
            setEndDate(dateStrings[1])
        }
    }

    return (
        <DateBox style={{ width: '100%' }}>
            <RangePicker
                size="large"
                showTime={{
                    hideDisabledOptions: true,
                }}
                defaultValue={[moment(startDate), moment(endDate)]}
                value={[moment(startDate), moment(endDate)]}
                format={'YYYY-MM-DD HH:mm'}
                onCalendarChange={handleCalendarChange}
                disabledDate={disabledDate}
                allowClear={false}
            />
        </DateBox>
    )
}

export default SpecDatePicker
