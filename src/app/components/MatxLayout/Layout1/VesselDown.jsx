import { Box, styled } from '@mui/system'
import { IconButton, Icon } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { convertHexToRGB } from 'app/utils/utils'
import { Card, Grid, Button } from '@mui/material'
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
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
    '&:hover': {
        backgroundColor: '#095435',
    },
}))
const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))
const { RangePicker } = DatePicker

const VesselDataDownload = ({ handleDialogClose, shouldOpenEditorDialog }) => {
    const [startDate, setStartDate] = useState('2020-01-01')
    const [endDate, setEndDate] = useState('2020-02-02')

    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 14]) ||
                current > moment.utc([2023, 11, 31]))
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
            return `https://storage.googleapis.com/shiplocationdata/ship_${year}/${year}_${month}_${day}.csv.zip`
        })
    }

    async function downloadZip() {
        let dataList = generateDateList(startDate, endDate)
        let lst = generateUrlList(dataList)

        const zip = new JSZip()

        for (const url of lst) {
            // for (const fileName of dataList) {
            // const year = fileName.split('-')[0]
            const response = await fetch(url)
            const file = await response.blob()
            const fileName = url.split('/').pop()
            zip.folder('ship_2022').file(fileName, file)
        }
        // Generate the zip file
        const zipFile = await zip.generateAsync({ type: 'blob' })
        // Save the zip file to the user's device
        saveAs(zipFile, 'ship_2022.zip')
    }

    const handleCalendarChange = (dates, dateStrings, info) => {
        // Set start date
        setStartDate(dateStrings[0])
        setEndDate(dateStrings[1])
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
                        <StyledButton onClick={downloadZip}>
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
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}

export default VesselDataDownload
