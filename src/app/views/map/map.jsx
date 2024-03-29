import React, {
    useRef,
    useEffect,
    useState,
    Fragment,
    useCallback,
} from 'react'
// import GrapDialog from 'app/views/CRUD/GrapDialog'
import GraphDialog from 'app/views/CRUD/GraphDialog'
import { useDispatch, useSelector } from 'react-redux'
import { GET_INIT_GRAPH } from 'app/redux/actions/GraphActions.js'

import { styled, Box } from '@mui/system'

const StyledBox = styled(Box)(() => ({
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
}))

const TimeSliderBox = styled('div')(() => ({
    position: 'absolute',
    width: '700px',
    left: '5%',
    right: '5%',
    bottom: '20px',
}))

export default function WebMap() {
    const elementRef = useRef()
    const { graphList = [] } = useSelector((state) => state.graph)
    const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false)
    const [currentLocation, setCurrentLocation] = useState('')
    const dispatch = useDispatch()

    const handleDialogClose = () => {
        setShouldOpenEditorDialog(false)
        dispatch({
            type: GET_INIT_GRAPH,
            payload: {},
        })
    }

    const handleOpenDialog = useCallback((open, currentLocation) => {
        setShouldOpenEditorDialog(open)
        setCurrentLocation(currentLocation)
    }, [])

    useEffect((_) => {
        let cleanup
        import('./mapcore').then(
            (app) =>
                (cleanup = app.initialize(
                    elementRef.current,
                    setCurrentLocation,
                    handleOpenDialog
                ))
        )
        return () => cleanup && cleanup()
    }, [])

    // assign elementRef to the ref of our component
    return (
        <>
            <StyledBox className="viewDiv" ref={elementRef}></StyledBox>
            <TimeSliderBox id="timeSlider"></TimeSliderBox>

            {shouldOpenEditorDialog && (
                <GraphDialog
                    currentLocation={currentLocation}
                    graphData={graphList}
                    handleClose={handleDialogClose}
                    open={shouldOpenEditorDialog}
                />
            )}
        </>
    )
}
