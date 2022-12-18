import React, { useEffect, useState } from 'react'
import { Grid, Button } from '@mui/material'
import SpecDatePicker from 'app/components/DatePicker/SpecDatePicker'
import { Box, styled } from '@mui/system'
import {
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material'
import { getWindRainGraph } from 'app/redux/actions/GraphActions'
import { useDispatch, useSelector } from 'react-redux'
import { getApiLocation } from '../../utils/utils'
import AccordionDescrip from 'app/components/Accordion/Accordion'
import { getUpdatedGraph } from 'app/redux/actions/GraphActions'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DownloadCsv from 'app/components/Download/DownloadCsv'
import DownloadPng from 'app/components/Download/DownloadPng'

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '-10px',
    '&:hover': {
        cursor: 'pointer',
    },
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    marginBottom: '10px',
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xl')]: {
        justifyContent: 'flex-start',
    },
}))

const MeteGraph = ({ currentLocation, selectedValue }) => {
    const [startDate, setStartDate] = useState('2020-01-01')
    const [endDate, setEndDate] = useState('2020-02-02')
    const [frequency, setFrequency] = useState(50)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [meteGrahphType, setMeteGrahphType] = useState('WindSpeed')
    const [meteWindSpeedType, setmeteWindSpeedType] = useState('WindMagnitude')
    const dispatch = useDispatch()

    const { initWindRainGraph } = useSelector((state) => state.graph)
    const location = getApiLocation(currentLocation)

    const handleUpdateGraph = () => {
        setLoading(true)
        fetchWindRainData()
    }
    const handleMeteTypeChange = (event) => {
        setMeteGrahphType(event.target.value)
    }

    const removeFirstZeroInString = (str) => {
        if (str.charAt(0) === '0') {
            str = str.slice(1)
        }
        return str
    }

    // set type for wind speed
    const handleWindSpeedTypeChange = (event) => {
        setmeteWindSpeedType(event.target.value)
    }

    const processDateForWindRain = (dataString) => {
        let dataLst = dataString.split('-')
        return {
            year: dataLst[0],
            month: removeFirstZeroInString(dataLst[1]),
            date: removeFirstZeroInString(dataLst[2]),
        }
    }

    const fetchWindRainData = async () => {
        let start = processDateForWindRain(startDate)
        let end = processDateForWindRain(endDate)

        await dispatch(
            getWindRainGraph(
                meteGrahphType,
                start,
                end,
                currentLocation,
                meteWindSpeedType
            )
        )
    }

    useEffect(() => {
        if (Object.keys(initWindRainGraph).length === 0) {
            setMeteGrahphType('WindSpeed')
            setLoading(true)
            fetchWindRainData()
        }
    }, [currentLocation])

    useEffect(() => {
        if (Object.keys(initWindRainGraph).length !== 0) {
            const outer = document.getElementById('outer4')

            const el = document.createElement('div')
            el.setAttribute('id', 'graphBox4')
            outer.appendChild(el)
            window.Bokeh.embed.embed_item(initWindRainGraph, 'graphBox4')
            setLoading(false)
            return () => {
                if (document.getElementById('graphBox4')) {
                    const h1 = document.getElementById('graphBox4')
                    h1.remove()
                }
            }
        }
    }, [initWindRainGraph])

    return (
        <>
            <Grid
                item
                lg={4}
                md={10}
                sm={12}
                xs={12}
                display="flex"
                alignItems="center"
                pt={0}
                sx={{ height: '70px' }}
            >
                <SpecDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </Grid>

            <Grid item lg={3} md={3} sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={meteGrahphType}
                        label="Type"
                        defaultValue={'WindSpeed'}
                        onChange={handleMeteTypeChange}
                    >
                        <MenuItem value={'WindSpeed'}>Wind Speed</MenuItem>
                        <MenuItem value={'RainRate'}>
                            Precipitation Rate
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {meteGrahphType === 'WindSpeed' && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">
                            Wind Speed Type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={meteWindSpeedType}
                            label="Type"
                            defaultValue={'WindMagnitude'}
                            onChange={handleWindSpeedTypeChange}
                        >
                            <MenuItem value={'WindMagnitude'}>
                                Wind Magnitude
                            </MenuItem>
                            <MenuItem value={'WindAngle'}>Wind Angle</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            )}

            <Grid container p={1} pt={3} pb={0}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ButtonBox>
                        <StyledButton
                            variant="contained"
                            component="span"
                            onClick={handleUpdateGraph}
                        >
                            <AutorenewIcon sx={{ mr: 1 }} />
                            Update
                        </StyledButton>

                        <DownloadCsv
                            loading={loading}
                            startDate={startDate}
                            endDate={endDate.substring(0, 10)}
                            frequency={frequency}
                            setLoading={setLoading}
                            location={location}
                            selectedValue={selectedValue}
                            currentLocation={currentLocation}
                            currType={meteGrahphType}
                            meteGrahphType={meteGrahphType}
                        />

                        <DownloadPng
                            loading={loading}
                            image={image}
                            setLoading={setLoading}
                            startDate={startDate}
                            endDate={endDate}
                            location={location}
                            frequency={frequency}
                            selectedValue={'Spec'}
                            name={'PNG'}
                            ctdType="left"
                            meteGrahphType={meteGrahphType}
                        />
                    </ButtonBox>

                    <AccordionDescrip
                        selectedValue={'Mete'}
                        currType={meteGrahphType}
                    />
                </Grid>
            </Grid>

            <Grid container>
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
                            className="buttonProgress"
                        />
                    </Grid>
                )}
            </Grid>

            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <FlexBox>
                        <Box id="outer4"></Box>
                    </FlexBox>
                </Grid>
            </Grid>
        </>
    )
}

export default React.memo(MeteGraph)
