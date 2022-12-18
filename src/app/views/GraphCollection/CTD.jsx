import React, { useEffect, useState } from 'react'
import { Grid, Button } from '@mui/material'
import CTDDatePicker from 'app/components/DatePicker/CTDDatePicker'
import { Box, styled } from '@mui/system'
import clsx from 'clsx'
import {
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material'
import {
    getCTPInitialGraph,
    getCTPInitialGraphLine,
} from 'app/redux/actions/GraphActions'
import { useDispatch, useSelector } from 'react-redux'
import { getApiLocation } from '../../utils/utils'
import AccordionDescrip from 'app/components/Accordion/Accordion'
import { getUpdatedGraph } from 'app/redux/actions/GraphActions'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DownloadCsv from 'app/components/Download/DownloadCsv'
import DownloadPng from 'app/components/Download/DownloadPng'
import SingleDatePicker from 'app/components/DatePicker/SingleDatePicker'

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
}))

const ctdValid = [
    'Oregon Offshore',
    'Oregon Slope',
    'Oregon Shelf',
    'Axial Base',
]

const CTD = ({ currentLocation, selectedValue }) => {
    const [startDate, setStartDate] = useState('2020-01-01')
    const [endDate, setEndDate] = useState('2020-02-02')
    const [loading, setLoading] = useState(false)
    const [currType, setCurrType] = useState('CTD')
    const location = getApiLocation(currentLocation)
    const [ctdType, setCtdType] = useState('Longterm')
    const { initCtpGraph } = useSelector((state) => state.graph)
    const { initCtpGraphLine } = useSelector((state) => state.graph)
    const [rightPanelDate, setRightPanelDate] = useState('2015-01-01')
    const dispatch = useDispatch()

    const handleUpdateGraph = () => {
        setLoading(true)
        if (selectedValue === 'CTD' && ctdType === 'Longterm') {
            const newEndDate = endDate.substring(0, 10)
            dispatch(getCTPInitialGraph(location, startDate, newEndDate))
        } else if (selectedValue === 'CTD' && ctdType === 'Shortterm') {
            dispatch(getCTPInitialGraphLine(location, rightPanelDate))
        }
    }

    const fetchCTPData = async () => {
        await dispatch(getCTPInitialGraph(location, startDate, endDate))
    }

    const fetchCTDLineData = async () => {
        await dispatch(getCTPInitialGraphLine(location, '2015-01-01'))
    }

    const handleTypeDropDown = (event) => {
        setCtdType(event.target.value)
    }

    useEffect(() => {
        if (
            Object.keys(initCtpGraph).length === 0 &&
            Object.keys(initCtpGraphLine).length === 0
        ) {
            if (ctdValid.includes(currentLocation)) {
                setLoading(true)
                fetchCTPData()
                fetchCTDLineData()
            }
        }
    }, [currentLocation])

    useEffect(() => {
        if (Object.keys(initCtpGraph).length !== 0) {
            // embed CTD left graph
            const outer = document.getElementById('outer2')
            const el = document.createElement('div')
            el.setAttribute('id', 'graphBox2')
            outer.appendChild(el)
            window.Bokeh.embed.embed_item(initCtpGraph, 'graphBox2')
            setLoading(false)
            return () => {
                if (document.getElementById('graphBox2')) {
                    const h1 = document.getElementById('graphBox2')
                    h1.remove()
                }
            }
        }
    }, [initCtpGraph])

    useEffect(() => {
        if (Object.keys(initCtpGraphLine).length !== 0) {
            // // embed CTD right graph
            const outer3 = document.getElementById('outer3')
            const el3 = document.createElement('div')
            el3.setAttribute('id', 'graphBox3')
            outer3.appendChild(el3)
            window.Bokeh.embed.embed_item(initCtpGraphLine, 'graphBox3')

            setLoading(false)
            return () => {
                if (document.getElementById('graphBox3')) {
                    const h1 = document.getElementById('graphBox3')
                    h1.remove()
                }
            }
        }
    }, [initCtpGraphLine])

    return (
        <>
            {ctdValid.includes(currentLocation) && (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                        <InputLabel id="demo-simple-select-label">
                            Type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ctdType}
                            label="Type"
                            defaultValue={'Longterm'}
                            onChange={handleTypeDropDown}
                        >
                            <MenuItem value={'Longterm'}>Long term</MenuItem>
                            <MenuItem value={'Shortterm'}>Short term</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            )}

            {ctdValid.includes(currentLocation) && ctdType === 'Longterm' && (
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
                    <CTDDatePicker
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                </Grid>
            )}

            {ctdType === 'Shortterm' && (
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
                        <SingleDatePicker
                            setRightPanelDate={setRightPanelDate}
                        />
                    </Grid>
                </>
            )}

            {ctdValid.includes(currentLocation) && (
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
                                currType={currType}
                                setLoading={setLoading}
                                location={location}
                                selectedValue={selectedValue}
                                currentLocation={currentLocation}
                            />

                            <DownloadPng
                                loading={loading}
                                currType={currType}
                                setLoading={setLoading}
                                startDate={startDate}
                                endDate={endDate}
                                location={location}
                                selectedValue={'CTD'}
                                name={'PNG'}
                                ctdType="left"
                            />
                        </ButtonBox>

                        <AccordionDescrip
                            selectedValue={'CTD'}
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

            {!ctdValid.includes(currentLocation) && (
                <Box p={3}>This location doesn't have CTD.</Box>
            )}

            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <FlexBox>
                        <Box
                            id="outer2"
                            className={clsx(
                                selectedValue === 'CTD' &&
                                    ctdType === 'Longterm'
                                    ? 'showGraph'
                                    : 'hideGraph'
                            )}
                        ></Box>
                        <Box
                            id="outer3"
                            className={clsx(
                                selectedValue === 'CTD' &&
                                    ctdType === 'Shortterm'
                                    ? 'showGraph'
                                    : 'hideGraph'
                            )}
                        ></Box>
                    </FlexBox>
                </Grid>
            </Grid>
        </>
    )
}

export default React.memo(CTD)
