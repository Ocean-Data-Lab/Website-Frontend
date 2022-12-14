import React, {useRef} from 'react'
import {
    IconButton
} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Paragraph, H2 } from 'app/components/Typography'
import { Box, styled } from '@mui/system'
const StyledAccordion = styled(Accordion)(() => ({
    "& .MuiAccordionSummary-content": {
      display: "none"
    },
    "& .Mui-expanded": {
      display: "none",
      height: 0,
      minHeight: 0
    }
}));

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    marginTop: '10px',
    alignItems: 'center',
    '&:hover': {
        cursor: 'pointer'
    }
}))

const AccordionDescrip = ({ selectedValue, currType }) => {
    const Accordion = useRef(null);
    const handleAccordion = () => {
        Accordion.current.click();
    };


    return (
        <>
            <ButtonBox onClick={handleAccordion}>
                <IconButton>
                    <HelpIcon />
                </IconButton>
                {selectedValue === 'Spec' && <Paragraph sx={{ ml: '-2px', fontWeight: '400'}}>
                    How is {currType} generated?
                </Paragraph>}
                {selectedValue === 'CTD' && <Paragraph sx={{ ml: '-2px', fontWeight: '400'}}>
                    How is CTD generated?
                </Paragraph>}
                {selectedValue === 'Mete' && <Paragraph sx={{ ml: '-2px', fontWeight: '400'}}>
                    How are wind Graph and rain graph generated?
                </Paragraph>}
            </ButtonBox>
            <StyledAccordion
                sx={{
                    color: "success.main",
                    "& .MuiSlider-thumb": {
                        borderRadius: "1px"
                    },
                    mb: 3
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
                        "& .MuiSlider-thumb": {
                        borderRadius: "1px"
                        }
                    }}
                    >
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -2}}>
                    {selectedValue === "Spec" && currType === 'Spectrogram' &&  <Paragraph sx={{ color: '#696665' }}>
                        Low frequency spectrograms are calculated using a 15 min Welch-median PSD estimate using a Hann window, 512 FFT points, and 50% overlap.
                    </Paragraph>}

                    {selectedValue === "Spec" && currType === 'SPDF' &&  <Paragraph sx={{ color: '#696665' }}>
                        SPDFs are calculated from the long-term spectrograms by computing histograms for each frequency bin. Plotting the histogram values as a function of frequency and spectral level gives the desired SPDFs.
                    </Paragraph>}

                    {selectedValue === "Mete" &&  <Paragraph sx={{ color: '#696665' }}>
                        Wind Graph (at zero degree, wind direction is eastward): <br></br>
                        1. If "Wind Magnitude" is selected, the wind speed is calculated throught the following formula:<br></br>
                            wind magnitude = np.sqrt((eastward_wind_velocity)**2 + (northward_wind_velocity)**2)<br></br>
                        2. If "Wind Angle" is selected, the wind speed is calculated throught the following formula:<br></br>
                            wind angle = np.arctan2(northward_wind_velocity, eastward_wind_velocity)<br></br>
                        <br></br>
                        Rain Graph: <br></br>
                        for the precipitation rate, two major operations are performed:<br></br>
                        1. Time frames where sampling period changes are removed<br></br>
                        2. Siphoning events are removed<br></br>
                    </Paragraph>}

                    <br />

                    <Paragraph sx={{ color: '#696665' }}>
                    </Paragraph>
                    {selectedValue !== "Mete" &&
                        <Paragraph sx={{ color: '#A09C9C', fontStyle: 'italic' }}>
                            Notice: For CSV downloading, if the table contains an empty value like "Nan", it will be replace by 0
                        </Paragraph>
                    }
                </AccordionDetails>
            </StyledAccordion>
        </>
    )
}

export default AccordionDescrip
