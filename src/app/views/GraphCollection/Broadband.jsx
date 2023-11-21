import React, { useEffect, useState } from 'react'
import { Grid, Button } from '@mui/material'
import SpecDatePicker from 'app/components/DatePicker/SpecDatePicker'
import { Box, styled } from '@mui/system'
import {
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material'
import { getInitialGraph } from 'app/redux/actions/GraphActions'
import { useDispatch, useSelector } from 'react-redux'
import { getApiLocation } from '../../utils/utils'
import AccordionDescrip from 'app/components/Accordion/Accordion'
import { getSTUpdatedGraph } from 'app/redux/actions/GraphActions'
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

const IMG = styled('img')(({ theme }) => ({
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
        width: '110%',
    },
}))

const broadValid = [
    'Oregon Shelf',
    'Oregon Slope',
    'Slope Base',
    'Axial Base',
    'Oregon Offshore'
]

const doubleValid = [
    'Oregon Slope',
    'Slope Base',
    'Axial Base'
]

const Spectrogram = ({ currentLocation, selectedValue }) => {
    const [startDate, setStartDate] = useState('2021-09-01T00:00')
    const [endDate, setEndDate] = useState('2021-09-01T00:05')
    const [graphType, setGraphType] = useState('Broadband')
    const [avg_time, setAvgTime] = useState(1)
    const [nperseg, setNperseg] = useState(4096)
    const [overlap, setOverlap] = useState(50)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [currType, setCurrType] = useState('Broadband')
    const [locType, setLocType] = useState('Seafloor')
    const dispatch = useDispatch()
    const { initSpecGraph } = useSelector((state) => state.graph)
    const location = getApiLocation(currentLocation)

    const handleSTUpdateGraph = () => {
        setLoading(true)
        setCurrType(graphType)
        dispatch(
            getSTUpdatedGraph(startDate, endDate, graphType, location, locType, overlap, nperseg, avg_time)
        )
    }

    const fetchSpecData = async () => {
        await dispatch(getInitialGraph(startDate, endDate, location))
    }

    const checkAvgTime = () => {
        if (avg_time < 1 || avg_time > 3600) return true
        return false
    }

    // const checkRelValues = () => {
    //     if (avg_time*64000 <= nperseg) return true
    //     return false
    // }

    // const checkNperseg = () => {
    //     if (nperseg < 1 || nperseg > 4096) return true
    //     return false
    // }

    const checkOverlap = () => {
        if (overlap < 1 || overlap > 100) return true
        return false
    }

    const handleAvgTimeChange = (event) => {
        setAvgTime(event.target.value)
    }

    const handleNpersegChange = (event) => {
        setNperseg(event.target.value)
    }

    const handleOverlapChange = (event) => {
        setOverlap(event.target.value)
    }

    const handleTypeDropDown = (event) => {
        setLocType(event.target.value)
    }

    useEffect(() => {
        if (broadValid.includes(currentLocation)) fetchSpecData()
    }, [currentLocation])

    useEffect(() => {
        if (currType === 'Broadband') {
            if (Object.keys(initSpecGraph).length !== 0) {
                setLoading(false)
                const outer = document.getElementById('outer')
                const el = document.createElement('div')
                el.setAttribute('id', 'graphBox')
                outer.appendChild(el)
                window.Bokeh.embed.embed_item(initSpecGraph, 'graphBox')
                return () => {
                    if (document.getElementById('graphBox')) {
                        const h1 = document.getElementById('graphBox')
                        h1.remove()
                    }
                }
            }
        }
    }, [initSpecGraph])

    return (
        <>
            {broadValid.includes(currentLocation) && (
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
                        // error={checkDates()}
                        // helperText={
                        //     checkDates() && 'Date range must be within 2 days'
                        // }
                    />
                </Grid>
            )}

            {doubleValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">
                            Hydrophone Depth
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={locType}
                            label="Type"
                            defaultValue={'Seafloor'}
                            onChange={handleTypeDropDown}
                        >
                            <MenuItem value={'Seafloor'}>
                                Seafloor
                            </MenuItem>
                            <MenuItem value={'Shallow'}>
                                Shallow
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {broadValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkAvgTime()}
                        // error={checkAvgTime() || checkRelValues()}
                        helperText={
                            (checkAvgTime() && 'Averaging Time not in valid range')
                            // (checkAvgTime() && 'Averaging Time not in valid range') ||
                            // (checkRelValues() && 'Avg Time x 64000 > nperseg not met')
                        }
                        disabled={graphType === 'Broadband' ? false : true}
                        required
                        value={avg_time}
                        id="outlined-required"
                        label="Averaging Time (in secs) : 1-3600"
                        onChange={handleAvgTimeChange}
                    />
                </Grid>
            )}

            {broadValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        // error={checkNperseg()}
                        // helperText={
                        //     checkNperseg() && 'Nperseg not in valid range'
                        // }
                        disabled={graphType === 'Broadband' ? false : true}
                        required
                        value={nperseg}
                        id="outlined-required"
                        label="N per segment for FFT"
                        onChange={handleNpersegChange}
                    />
                </Grid>
            )}

            {broadValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkOverlap()}
                        helperText={
                            checkOverlap() && 'Overlap not in valid range'
                        }
                        disabled={graphType === 'Broadband' ? false : true}
                        required
                        value={overlap}
                        id="outlined-required"
                        label="Overlap : 1-100"
                        onChange={handleOverlapChange}
                    />
                </Grid>
            )}

            {broadValid.includes(currentLocation) && (
                <Grid container p={1} pt={3} pb={0}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ButtonBox>
                            <StyledButton
                                disabled={checkAvgTime()}
                                variant="contained"
                                component="span"
                                onClick={handleSTUpdateGraph}
                            >
                                <AutorenewIcon sx={{ mr: 1 }} />
                                Update
                            </StyledButton>

                            {/* <DownloadCsv
                                loading={loading}
                                startDate={startDate}
                                endDate={endDate.substring(0, 10)}
                                frequency={frequency}
                                currType={currType}
                                setLoading={setLoading}
                                location={location}
                                selectedValue={selectedValue}
                                currentLocation={currentLocation}
                            />

                            <DownloadPng
                                loading={loading}
                                currType={currType}
                                image={image}
                                setLoading={setLoading}
                                startDate={startDate}
                                endDate={endDate}
                                location={location}
                                frequency={frequency}
                                selectedValue={'Broad'}
                                name={'PNG'}
                                ctdType="left"
                            /> */}
                        </ButtonBox>

                        <AccordionDescrip
                            selectedValue={'Broad'}
                            currType={currType}
                        />
                    </Grid>
                </Grid>
            )}

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
                    <FlexBox style={{ overflow: 'auto' }}>
                        <Box id="outer"></Box>
                    </FlexBox>
                </Grid>
            </Grid>

        </>
    )
}

export default React.memo(Spectrogram)