import { Box, styled } from '@mui/system'
import { IconButton, Icon } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { convertHexToRGB } from 'app/utils/utils'
import { Card, Grid, Button, CircularProgress } from '@mui/material'
import { DatePicker } from 'antd'
import * as moment from 'moment'
import React, { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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
    backgroundColor: '#d1d1d1',
    // backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
    '&:hover': {
        // backgroundColor: '#095435',
    },
}))
const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))
const { RangePicker } = DatePicker

const VesselDataDownload = ({ handleDialogClose, shouldOpenEditorDialog }) => {
    const [startDate, setStartDate] = useState('2022-01-01')
    const [endDate, setEndDate] = useState('2022-02-01')

    const [loading, setLoading] = useState(false)

    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 1]) ||
                current > moment.utc([2022, 5, 30]))
        )
    }

    const generateDateList = (startDate, endDate) => {
        // Convert the start and end dates to Date objects
        const start = new Date(startDate)
        const end = new Date(endDate)

        // Initialize an empty array to store the dates
        const dates = []

        // Set the current date to the start date
        let currentDate = start

        // Add the start date to the array
        dates.push(start.toISOString().split('T')[0])

        // Iterate through all the dates between the start and end dates
        while (currentDate < end) {
            // Add one day to the current date
            currentDate.setDate(currentDate.getDate() + 1)
            // Add the current date to the array
            dates.push(currentDate.toISOString().split('T')[0])
        }
        // Return the array of dates
        return dates
    }

    function generateUrlList(dateList) {
        return dateList.map((date) => {
            const [year, month, day] = date.split('-')
            return `https://storage.googleapis.com/shiplocationdata/${year}/${year}_${month}_${day}.csv`
        })
    }

    async function downloadZip() {
        setLoading(true)
        let dataList = generateDateList(startDate, endDate)
        let lst = generateUrlList(dataList)

        const zip = new JSZip()

        for (const url of lst) {
            const response = await fetch(url)
            const file = await response.blob()
            const fileName = url.split('/').pop()
            zip.folder(`${startDate + '_' + endDate}`).file(fileName, file)
        }
        // Generate the zip file
        const zipFile = await zip.generateAsync({ type: 'blob' })
        // Save the zip file to the user's device
        saveAs(zipFile, `${startDate + '_' + endDate}.zip`)
        setLoading(false)
    }

    const handleCalendarChange = (dates, dateStrings, info) => {
        if (
            dateStrings[1] === '' ||
            (dateStrings[0] !== startDate && dateStrings[1] === endDate)
        ) {
            const futureMonth = moment(dateStrings[0]).add(1, 'M')
            const next = moment(futureMonth._d)

            setStartDate(dateStrings[0])
            setEndDate(next.format('YYYY-MM-DD'))
        } else {
            setStartDate(dateStrings[0])

            const futureMonth = moment(dateStrings[1])
            const next = moment(futureMonth._d)
            setEndDate(next.format('YYYY-MM-DD'))
            // setEndDate(dateStrings[1])
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
                    <FlexBox>
                        <Box style={{ marginRight: '10px' }}>Time Range</Box>
                        <RangePicker
                            size="large"
                            // disabled={selectedValue === 'Spec' ? [false, false] : [true, true]}
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
                        <StyledButton onClick={downloadZip} disabled>
                            Download
                        </StyledButton>
                    </FlexBox>

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

                    {loading && (
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            mb="20px"
                        >
                            <CircularProgress
                                size={24}
                                style={{ color: '#22a6c7', marginTop: '10px' }}
                            />
                        </Grid>
                    )}
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}

export default VesselDataDownload
