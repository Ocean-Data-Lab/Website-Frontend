import React, { useRef } from 'react'
import { IconButton } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Paragraph } from 'app/components/Typography'
import { Box, styled } from '@mui/system'
const StyledAccordion = styled(Accordion)(() => ({
    '& .MuiAccordionSummary-content': {
        display: 'none',
    },
    '& .Mui-expanded': {
        display: 'none',
        height: 0,
        minHeight: 0,
    },
}))

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    marginTop: '10px',
    alignItems: 'center',
    '&:hover': {
        cursor: 'pointer',
    },
}))

const AccordionDescrip = ({ selectedValue, currType }) => {
    const Accordion = useRef(null)
    const handleAccordion = () => {
        Accordion.current.click()
    }

    return (
        <>
            <ButtonBox onClick={handleAccordion}>
                <IconButton>
                    <HelpIcon />
                </IconButton>
                {selectedValue === 'Spec' && (
                    <Paragraph sx={{ ml: '-2px', fontWeight: '400' }}>
                        How is the {currType} graph generated?
                    </Paragraph>
                )}
                {selectedValue === 'Broad' && (
                    <Paragraph sx={{ ml: '-2px', fontWeight: '400' }}>
                        How is the Broadband Spectrogram graph generated?
                    </Paragraph>
                )}
                {selectedValue === 'CTD' && (
                    <Paragraph sx={{ ml: '-2px', fontWeight: '400' }}>
                        How is CTD generated?
                    </Paragraph>
                )}
                {selectedValue === 'Mete' && (
                    <Paragraph sx={{ ml: '-2px', fontWeight: '400' }}>
                        How are wind Graph and rain graph generated?
                    </Paragraph>
                )}
            </ButtonBox>
            <StyledAccordion
                sx={{
                    color: 'success.main',
                    '& .MuiSlider-thumb': {
                        borderRadius: '1px',
                    },
                    mb: 3,
                }}
            >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    ref={Accordion}
                    id="panel1a-header"
                    sx={{
                        height: 0,
                        minHeight: 0,
                        maxHeight: 0,
                        '& .MuiSlider-thumb': {
                            borderRadius: '1px',
                        },
                    }}
                ></AccordionSummary>
                <AccordionDetails sx={{ mt: -2 }}>
                    {selectedValue === 'Spec' && currType === 'Spectrogram' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            Low frequency spectrograms are pre-computed and saved locally. This method is best for looking at long time frames (like months or years). The spectrograms are calculated using a 1 hour Welch-median PSD estimate. The Welch estimate uses a Hann window, 1024 FFT points and 50 % overlap.
                        </Paragraph>
                    )}

                    {selectedValue === 'Spec' && currType === 'ST Spectrogram' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            Short Term Spectrograms are generated by pulling the specific time-series data from the OOI server and computing the spectrogram. This allows the user to specify the input parameters to the Welch PSD estimate, but is limited to smaller time frames (like days or hours).
                        </Paragraph>
                    )}

                    {selectedValue === 'Broad' && currType === 'Broadband' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            Broadband spectrograms are computed by downloading the data from the OOI server and computing the spectrogram locally. The data is downloaded using the python package OOIPY. The input parameters for the Welch PSD estimate can be provided by the user. Because the broadband hydrophone data takes up a lot of memory (1.8 GB per hour), this method is only suitable for short durations of data (like minutes and seconds).
                        </Paragraph>
                    )}

                    {selectedValue === 'Spec' && currType === 'OBS' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            The OBS data is from the z-channel of the OBS. the spectrograms are pre-computed and saved locally. This allows for the longer term data to be visualized. The spectrograms are calculated using a 1 hour Welch-median PSD estimate. The Welch estimate uses a Hann window, 1024 FFT points and 50 % overlap.
                        </Paragraph>
                    )}

                    {selectedValue === 'Spec' && currType === 'SPDF' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            SPDFs are calculated from the long-term spectrograms
                            by computing histograms for each frequency bin.
                            Plotting the histogram values as a function of
                            frequency and spectral level gives the desired
                            SPDFs.
                        </Paragraph>
                    )}

                    {selectedValue === 'Spec' && currType === 'Octave Band' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            The boxes of the plot are generated by using the
                            minimum, first quartile value(lower line), median,
                            third quartile value(upper line), maximum.
                            Outliers(values that are above the upper line and
                            below the lower line are hidden)
                        </Paragraph>
                    )}

                    {selectedValue === 'Mete' && (
                        <Paragraph sx={{ color: '#696665' }}>
                            Wind Graph (at zero degree, wind direction is
                            eastward): <br></br>
                            1. If "Wind Magnitude" is selected, the wind speed
                            is calculated throught the following formula:
                            <br></br>
                            wind magnitude = np.sqrt((eastward_wind_velocity)**2
                            + (northward_wind_velocity)**2)<br></br>
                            2. If "Wind Angle" is selected, the wind speed is
                            calculated throught the following formula:<br></br>
                            wind angle = np.arctan2(northward_wind_velocity,
                            eastward_wind_velocity)<br></br>
                            <br></br>
                            Rain Graph: <br></br>
                            for the precipitation rate, two major operations are
                            performed:<br></br>
                            1. Time frames where sampling period changes are
                            removed<br></br>
                            2. Siphoning events are removed<br></br>
                        </Paragraph>
                    )}

                    <br />

                    <Paragraph sx={{ color: '#696665' }}></Paragraph>
                </AccordionDetails>
            </StyledAccordion>
        </>
    )
}

export default AccordionDescrip
