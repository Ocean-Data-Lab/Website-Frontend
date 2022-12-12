import React from 'react'
import { styled } from '@mui/system'
import { Grid, Box } from '@mui/material'
import { H1, H4 } from 'app/components/Typography'

const VideosRoot = styled('div')(({ theme }) => ({
    margin: '60px',
    [theme.breakpoints.down('sm')]: {
        margin: '30px',
    },
}))

const StyledHeader = styled(H1)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: '19px',
    },
}))

const VideoIntro = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontWeight: 700,
    marginBottom: '10px',
}))
const Note = styled(Box)(() => ({
    fontSize: '14px',
    color: '#7e7f80',
}))

const YoutubeEmbed = ({
    embedId,
    SoundType,
    Location,
    StartTime,
    EndTime,
    HydrophoneType,
}) => (
    <div className="video-responsive">
        <VideoIntro>
            <span>Type: {SoundType}</span>
            <span>Location: {Location}</span>
            <span>Start Time: {StartTime}</span>
            <span>End Time: {EndTime}</span>
            <span>Hydrophone Type: {HydrophoneType}</span>
        </VideoIntro>
        <iframe
            width="780"
            height="460"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
)

const createVideoChunk = (id, soundtype, location, start, end, hydroType) => (
    <Grid item lg={12} md={12} sm={12} xs={12} mb={5}>
        <YoutubeEmbed
            embedId={id}
            SoundType={soundtype}
            Location={location}
            StartTime={start}
            EndTime={end}
            HydrophoneType={hydroType}
        />
    </Grid>
)
const VideoPage = () => {
    return (
        <VideosRoot>
            <Grid
                container
                spacing={3}
                mt={2}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    mb={6}
                >
                    <StyledHeader>
                        Welcome to the Ocean Noice Explorer Video Gallery
                    </StyledHeader>
                    <H4>here are some interesting sound events</H4>
                    <Note>
                        Note: Sample rate of the sound files are adjusted to speed up
                        the audio
                    </Note>
                </Grid>
                {createVideoChunk(
                    'xp5jJUeLNRw',
                    'Airgun Pulses',
                    'Axial Base Seafloor (Fs = 64 kHz)',
                    '2019-08-01 15:00:03',
                    '2019-08-01 15:00:20',
                    'broadband'
                )}

                {createVideoChunk(
                    'kgeuBAxFB3E',
                    'Fin whale Calls',
                    'Axial Base Seaflor (Fs = 200 Hz)',
                    '2019-02-03 12:00:00',
                    '2019-02-03 12:15:00',
                    'low frequency'
                )}

                {createVideoChunk(
                    'qla5DjV2i_o',
                    'Ship Noise',
                    'Axial Base Seaflor (Fs = 200 Hz)',
                    '2016-01-08 21:54:00',
                    '2016-01-08 23:54:00',
                    'low frequency'
                )}

                {createVideoChunk(
                    'g4Fe43GChCw',
                    'Whale Vocalizations',
                    'Oregon Slope Base Seafloor (Fs = 64 kHz)',
                    '2017-10-06 20:00:00',
                    '2017-10-06 20:00:30',
                    'broadband'
                )}

                {createVideoChunk(
                    'erTn9MIQYIE',
                    'Axial Seamount Volcano Erruption',
                    'Axial Base Seaflor (Fs = 200 Hz)',
                    '2015-04-23 22:35:00',
                    '2015-04-23 22:45:00',
                    'low frequency'
                )}
            </Grid>
        </VideosRoot>
    )
}

export default VideoPage
