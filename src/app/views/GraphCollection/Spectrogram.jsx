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
import { getUpdatedGraph } from 'app/redux/actions/GraphActions'
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
const specValid = [
    'Axial Base',
    'Central Caldera',
    'Eastern Caldera',
    'Slope Base',
    'Southern Hydrate',
    'Axial Ashes',
    'Axial International',
]

const obsValid = [
    'Axial Base',
    'Slope Base',
    'Eastern Caldera',
    'Central Caldera',
    'Axial Ashes',
    'Axial International',
    'Southern Hydrate',
]

const Spectrogram = ({ currentLocation, selectedValue }) => {
    const [startDate, setStartDate] = useState('2020-01-01T00:00')
    const [endDate, setEndDate] = useState('2020-02-01T01:00:00')
    const [graphType, setGraphType] = useState('Spectrogram')
    const [frequency, setFrequency] = useState(50)
    const [avg_time, setAvgTime] = useState(3600)
    const [nperseg, setNperseg] = useState(1024)
    const [overlap, setOverlap] = useState(50)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [currType, setCurrType] = useState('Spectrogram')
    const [locType, setLocType] = useState('Seafloor')
    const dispatch = useDispatch()
    const { initSpecGraph } = useSelector((state) => state.graph)
    const location = getApiLocation(currentLocation)


    const handleUpdateGraph = () => {
        setLoading(true)
        setCurrType(graphType)
        if (selectedValue == 'OBS') {
            setGraphType('OBS')
            setCurrType('OBS')
        }
        dispatch(
            getUpdatedGraph(startDate, endDate, graphType, location, frequency)
        )
    }

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

    const handleTypeDropDown = (event) => {
        setGraphType(event.target.value)
    }

    const checkFrequecy = () => {
        if (frequency < 1 || frequency > 80) return true
        return false
    }

    // const checkDates = () => {
    //     if (Math.abs(Date.parse(endDate) - Date.parse(startDate))/(1000*3600) > 48) return true
    //     return false
    // }

    const checkAvgTime = () => {
        if (avg_time < 1 || avg_time > 3600) return true
        return false
    }

    const checkRelValues = () => {
        if (avg_time*200 <= nperseg) return true
        return false
    }

    const checkNperseg = () => {
        if (nperseg < 1 || nperseg > 1024) return true
        return false
    }

    const checkOverlap = () => {
        if (overlap < 1 || overlap > 100) return true
        return false
    }

    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value)
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

    useEffect(() => {
        if (specValid.includes(currentLocation)) fetchSpecData()
    }, [currentLocation])

    useEffect(() => {
        if (currType === 'Spectrogram' || currType === 'OBS' || currType === 'Octave Band' || currType === 'ST Spectrogram') {
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
        } else if (currType === 'SPDF') {
            setLoading(false)
            let imageResult = initSpecGraph['image']
            let image64 = imageResult.split("'")[1]
            setImage(image64)
        }
    }, [initSpecGraph])

    return (
        <>
            {specValid.includes(currentLocation) && (
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

            {specValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">
                            Type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={graphType}
                            label="Type"
                            defaultValue={'Spectrogram'}
                            onChange={handleTypeDropDown}
                        >
                            <MenuItem value={'Spectrogram'}>
                                Spectrogram
                            </MenuItem>
                            <MenuItem value={'ST Spectrogram'}>
                                Short Term Spectrogram
                            </MenuItem>
                            <MenuItem value={'SPDF'}>SPDF</MenuItem>
                            <MenuItem value={'Octave Band'}>
                                Octave Band
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {specValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkFrequecy()}
                        helperText={
                            checkFrequecy() && 'Frequency not in valid range'
                        }
                        disabled={graphType === 'Octave Band' ? false : true}
                        required
                        value={frequency}
                        id="outlined-required"
                        label="Required frequency 1-90"
                        onChange={handleFrequencyChange}
                    />
                </Grid>
            )}

            {specValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkAvgTime() || checkRelValues()}
                        helperText={
                            (checkAvgTime() && 'Averaging Time not in valid range') ||
                            (checkRelValues() && 'Avg Time x 200 > nperseg not met')
                        }
                        disabled={graphType === 'ST Spectrogram' ? false : true}
                        required
                        value={avg_time}
                        id="outlined-required"
                        label="Averaging Time (in secs) : 1-3600"
                        onChange={handleAvgTimeChange}
                    />
                </Grid>
            )}

            {specValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkNperseg()}
                        helperText={
                            checkNperseg() && 'Nperseg not in valid range'
                        }
                        disabled={graphType === 'ST Spectrogram' ? false : true}
                        required
                        value={nperseg}
                        id="outlined-required"
                        label="Nperseg : 1-1024"
                        onChange={handleNpersegChange}
                    />
                </Grid>
            )}

            {specValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        error={checkOverlap()}
                        helperText={
                            checkOverlap() && 'Overlap not in valid range'
                        }
                        disabled={graphType === 'ST Spectrogram' ? false : true}
                        required
                        value={overlap}
                        id="outlined-required"
                        label="Overlap : 1-100"
                        onChange={handleOverlapChange}
                    />
                </Grid>
            )}

            {specValid.includes(currentLocation) && (
                <Grid container p={1} pt={3} pb={0}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ButtonBox>
                            <StyledButton
                                disabled={checkFrequecy()}
                                variant="contained"
                                component="span"
                                onClick={graphType === "ST Spectrogram" ? handleSTUpdateGraph : handleUpdateGraph}
                            >
                                <AutorenewIcon sx={{ mr: 1 }} />
                                Update
                            </StyledButton>

                            <DownloadCsv
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
                                selectedValue={'Spec'}
                                name={'PNG'}
                                ctdType="left"
                            />
                        </ButtonBox>

                        <AccordionDescrip
                            selectedValue={'Spec'}
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
                {currType === 'SPDF' && image !== '' && (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FlexBox>
                            <IMG src={`data:image/jpg;base64,${image}`} />
                        </FlexBox>
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
