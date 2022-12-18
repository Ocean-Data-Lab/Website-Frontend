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

const MeteDatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
    const disabledDate = (current) => {
        // Parse the start and end dates into moment objects
        const start = moment('2015-05-01T00:00:00.000Z')
        const end = moment('2022-10-25T12:00:00.000Z')

        // Check if the current date is before the start date or after the end date
        return current && (current.isBefore(start) || current.isAfter(end))
    }

    const handleCalendarChange = (dates, dateStrings, info) => {
        // Set start date
        setStartDate(dateStrings[0])

        // If first item in dateStrings is different from startDate
        if (dateStrings[0] !== startDate) {
            // Add 1 month to end date
            const futureMonth = moment(dateStrings[1]).add(1, 'M')
            // Set end date
            setEndDate(futureMonth.format('YYYY-MM-DD'))
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
                format={'YYYY-MM-DD'}
                onCalendarChange={handleCalendarChange}
                disabledDate={disabledDate}
                allowClear={false}
            />
        </DateBox>
    )
}

export default MeteDatePicker
