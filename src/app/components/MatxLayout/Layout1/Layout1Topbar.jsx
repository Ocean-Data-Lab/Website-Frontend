import { styled, Box } from '@mui/system'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { topBarHeight } from 'app/utils/constant'
import Brand from '../../Brand/Brand'
import React, { useState } from 'react'
import { Drawer } from '@mui/material'
import { H4, Paragraph } from 'app/components/Typography'
import { Link } from 'react-router-dom'

const TopbarRoot = styled('div')(() => ({
    top: 0,
    zIndex: 96,
    transition: 'all 0.3s ease',
    boxShadow: themeShadows[8],
    height: topBarHeight,
}))

const TopbarContainer = styled(Box)(({ theme }) => ({
    padding: '8px',
    paddingLeft: 18,
    paddingRight: 20,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: 14,
        paddingRight: 16,
    },
}))

const ContentBox = styled('div')(({ theme }) => ({
    padding: '40px',
    width: '350px',
    [theme.breakpoints.down('sm')]: {
        width: '280px',
    },
}))

const ChunkBox = styled('div')(() => ({
    marginBottom: '40px',
}))

const InfoBox = styled(Box)(() => ({
    display: 'flex',
}))

const Options = styled(H4)(({ theme }) => ({
    margin: '15px',
    cursor: 'pointer'
}))

// d
const Layout1Topbar = () => {
    const anchor = 'right'
    const [state, setState] = useState({
        right: false,
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }
    return (
        <TopbarRoot>
            <TopbarContainer>
                <Link to="/">
                    <Box display="flex">
                        <Brand />
                    </Box>
                </Link>
                <InfoBox sx={{ p: 1 }}>
                    <Link to="/">
                        <Options>Map</Options>
                    </Link>
                    <Link to="/Video">
                        <Options>Gallery</Options>
                    </Link>
                    {/* <Options>Videos</Options> */}
                    <Options onClick={toggleDrawer(anchor, true)}>About</Options>
                </InfoBox>
                <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    p={4}
                >
                    <ContentBox>
                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>Director</H4>
                            <Paragraph
                                sx={{
                                    mt: 0,
                                    mb: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                Dr. Shima Abadi
                            </Paragraph>
                        </ChunkBox>

                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>About</H4>
                            <Paragraph
                                sx={{
                                    mt: 0,
                                    mb: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <a href="https://sites.uw.edu/abadi/people/" target="_blank" rel="noreferrer">
                                    Ocean Data Lab&nbsp;
                                </a>
                                at the University of Washington has developed a web-based interactive ocean soundscape that will enable users to visualize and explore a wide variety of underwater noise metrics and other related data products. The raw data used in this project is collected by the REgional Cabled Array and the Coastal Endurance Array of the&nbsp;
                                <a href="https://sites.uw.edu/abadi/people/" target="_blank" rel="noreferrer">
                                Ocean Observatories Initiative (OOI)
                                </a>
                                . The raw data is processed by OOIPY, a Python library developed by our team, to calculate different data products that are required for a comprehensive ocean soundscape analysis.
                            </Paragraph>
                        </ChunkBox>

                        <ChunkBox>
                            <H4 sx={{ mb: 1, fontWeight: 800 }}>Acknowledgement</H4>
                            <Box>
                            We thank the Office of Naval Research (ONR) for funding this research project and the National Science Foundation (NSF) for funding the OOI infrastructure.
                            </Box>
                        </ChunkBox>
                    </ContentBox>
                </Drawer>
            </TopbarContainer>
        </TopbarRoot>
    )
}

export default React.memo(Layout1Topbar)
