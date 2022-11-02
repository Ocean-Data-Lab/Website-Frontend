import { Outlet } from 'react-router-dom'
import Layout1Topbar from './Layout1Topbar'
import useSettings from 'app/hooks/useSettings'
import React, { useEffect, useRef } from 'react'
import { styled, Box, useTheme } from '@mui/system'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import MatxSuspense from 'app/components/MatxSuspense/MatxSuspense'

const Layout1Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    background: theme.palette.background.default,
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
}))

const LayoutContainer = styled(Box)(({ width }) => ({
    height: '100vh',
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
    verticalAlign: 'top',
    marginLeft: width,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
}))

const Layout1 = () => {
    const { settings, updateSettings } = useSettings()
    const { layout1Settings } = settings
    const topbarTheme = settings.themes[layout1Settings.topbar.theme]

    const theme = useTheme()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'))
    const ref = useRef({ isMdScreen, settings })
    const layoutClasses = `theme-${theme.palette.type}`

    useEffect(() => {
        let { settings } = ref.current
        let sidebarMode = settings.layout1Settings.leftSidebar.mode
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? 'close' : sidebarMode
            updateSettings({ layout1Settings: { leftSidebar: { mode } } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen])

    return (
        <Layout1Root className={layoutClasses}>
            <LayoutContainer>
                <ThemeProvider theme={topbarTheme}>
                    <Layout1Topbar fixed={true} />
                </ThemeProvider>

                <ContentBox>
                    <Box flexGrow={1} position="relative">
                        <MatxSuspense>
                            <Outlet />
                        </MatxSuspense>
                    </Box>
                </ContentBox>
            </LayoutContainer>
        </Layout1Root>
    )
}

export default React.memo(Layout1)
