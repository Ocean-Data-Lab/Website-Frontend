import { Box, styled } from '@mui/system'
import { IconButton, Icon } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { convertHexToRGB } from 'app/utils/utils'
import { Card, Grid, Button } from '@mui/material'
import { DatePicker } from 'antd'
import * as moment from 'moment'
import React, { useState } from 'react'

const StyledH3 = styled('div')(() => ({
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.5',
}))

const AnalyticsRoot = styled(Card)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        width: '90%',
        height: '80%',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
        height: '80%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '85vh',
    },
    '& .showGraph': {
        display: 'block',
    },
    '& .hideGraph': {
        display: 'none',
    },
}))

const ChartHeader = styled(Box)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    zIndex: 200,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    width: 'inherit',
    padding: '.8rem 1.25rem',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${`rgba(${convertHexToRGB(
        theme.palette.text.disabled
    )}, 0.2)`}`,
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100px',
    marginLeft: '10px',
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
    '&:hover': {
        backgroundColor: '#095435',
    },
}))
const { RangePicker } = DatePicker

const VesselDataDownload = ({ handleDialogClose, shouldOpenEditorDialog }) => {
    const [startDate, setStartDate] = useState('2020-01-01 00')
    const [endDate, setEndDate] = useState('2020-02-02 23')

    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 14]) ||
                current > moment.utc([2020, 11, 31]))
        )
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
        <Backdrop open={shouldOpenEditorDialog}>
            <AnalyticsRoot
                sx={{
                    width: '45%',
                    height: '30%',
                    overflow: 'scroll',
                }}
            >
                <ChartHeader>
                    <StyledH3>Vessel Data Download</StyledH3>
                    <IconButton onClick={handleDialogClose}>
                        <Icon sx={{ color: '#878484' }}>close</Icon>
                    </IconButton>
                </ChartHeader>

                <Grid
                    container
                    spacing={1}
                    p={4}
                    pb={0}
                    mt={7}
                    mb={2}
                    sx={{
                        '& .MuiTextField-root': { width: '100%' },
                    }}
                >
                    <Grid
                        item
                        lg={1.7}
                        md={1.7}
                        sm={12}
                        xs={12}
                        display="flex"
                        alignItems="center"
                    >
                        Date Range:
                    </Grid>
                    <Grid item lg={5} md={5} sm={12} xs={12}>
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
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <StyledButton>Download</StyledButton>
                    </Grid>

                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ color: '#969997' }}
                    >
                        Note: Download data can take a while, please be patient
                    </Grid>
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}

export default VesselDataDownload
