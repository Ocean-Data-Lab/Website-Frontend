import React from 'react'
import { Button, IconButton, Icon } from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { convertHexToRGB } from 'app/utils/utils'
import { Card, Grid } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Radio from '@mui/material/Radio'
import Spectrogram from '../GraphCollection/Spectrogram'
import CTD from '../GraphCollection/CTD'
import MeteGraph from '../GraphCollection/MeteGraph'

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

const StyledH3 = styled('div')(() => ({
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.5',
}))

const meteorologyValid = ['Oregon Offshore', 'Oregon Shelf']

const GraphDialog = ({ currentLocation, open, handleClose }) => {
    const { palette } = useTheme()
    const textPrimary = palette.text.primary
    // console.log('render')
    const [selectedValue, setSelectedValue] = React.useState('Spec')
    const handleRadioChange = async (event) => {
        setSelectedValue(event.target.value)
    }

    const controlProps = (item) => ({
        checked: selectedValue === item,
        onChange: handleRadioChange,
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
    })

    return (
        <Backdrop open={open} sx={{ zIndex: 101 }}>
            <AnalyticsRoot
                sx={{
                    width: '85%',
                    height: '80%',
                    overflow: 'scroll',
                }}
            >
                <ChartHeader>
                    <StyledH3>
                        {currentLocation} Hydrophone Visualization
                    </StyledH3>
                    <IconButton onClick={handleClose}>
                        <Icon sx={{ color: textPrimary }}>close</Icon>
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
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Radio {...controlProps('Spec')} /> Hydrophone Data
                        <Radio {...controlProps('CTD')} /> CTD Data
                        {meteorologyValid.includes(currentLocation) && (
                            <>
                                <Radio {...controlProps('Mete')} /> Meteorology
                                Data
                            </>
                        )}
                    </Grid>

                    {selectedValue === 'Spec' && (
                        <Spectrogram
                            currentLocation={currentLocation}
                            selectedValue={'Spec'}
                        />
                    )}

                    {selectedValue === 'CTD' && (
                        <CTD
                            currentLocation={currentLocation}
                            selectedValue={'CTD'}
                        />
                    )}

                    {selectedValue === 'Mete' && (
                        <MeteGraph
                            currentLocation={currentLocation}
                            selectedValue={'Mete'}
                        />
                    )}
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}
export default React.memo(GraphDialog)
