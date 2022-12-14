import React, { useRef, Fragment, useState } from 'react';
import axios from 'axios'
import { Button } from '@mui/material'
import { styled } from '@mui/system'
import DownloadIcon from '@mui/icons-material/Download'
import { CSVLink } from 'react-csv'
import { OCTAVE_BAND } from 'app/utils/DialogLabel'
import { SPDF } from "app/utils/DialogLabel"
import { handleOutputName } from "app/utils/utils"

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    backgroundColor: '#008255',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const DownloadCsv = ({ error, startDate, endDate, location, frequency, currType, setLoading, currentLocation, selectedValue, loading, meteGrahphType}) => {
    const [data, setData] = useState([])
    const csvLink = useRef(null)

    const removeFirstZeroInString = (str) => {
        if (str.charAt(0) === '0')
        {
            str = str.slice(1);
        }
        return str
    }

    const processDateForWindRain = (dataString) => {
        let dataLst = dataString.split("-")
        return { "year": dataLst[0], "month": removeFirstZeroInString(dataLst[1]), "date": removeFirstZeroInString(dataLst[2])}
    }

    const downloadCSV = () => {
        setLoading(true)

        if (location === "oregon_shelf" || location === "oregon_offshore")
        {
            startDate = processDateForWindRain(startDate)
            endDate = processDateForWindRain(endDate)
        }


        axios.post('/api/downloads', {
                startDate,
                endDate,
                location,
                currType,
                frequency,
                selectedValue,
                meteGrahphType
            })
            .then((res) => {
                setLoading(false)
                setData(res.data.data)
                csvLink.current.link.click()
            })
    }

    const handleCsvHeader = () => {
        if(selectedValue === "CTD") return null

        if (selectedValue === "Mete" && meteGrahphType === "WindSpeed")
        {
            return [
                { label: 'dateTime', key: 'dateTime' },
                { label: 'eastward_wind_velocity(radian)', key: 'eastward_wind_velocity' },
                { label: 'northward_wind_velocity(radian)', key: 'northward_wind_velocity' }
            ]
        } else if (selectedValue === "Mete" && meteGrahphType === "RainRate")
        {
            return [
                { label: 'dateTime', key: 'dateTime' },
                { label: 'precipitation', key: 'precipitation' },
            ]
        }

        switch (currType) {
            case 'Octave Band':
                return OCTAVE_BAND
            case 'SPDF':
                return SPDF
            default:
                return [
                    { label: 'time', key: 'time' },
                    { label: 'frequency', key: 'frequency' },
                    {
                        label: currentLocation,
                        key: location,
                    },
                ]
        }
    }

    return (
        <Fragment>
            <StyledButton
                disabled={
                    error === 'error' || loading ? true: false
                }
                variant="contained"
                component="span"
                onClick={downloadCSV}
                sx={{ backgroundColor: '#008255' }}
            >
                <DownloadIcon sx={{ mr: 1 }} />
                CSV
            </StyledButton>
            <CSVLink
                data={data}
                filename={handleOutputName(currentLocation, startDate, endDate, selectedValue)}
                className="hidden"
                ref={csvLink}
                target="_blank"
                headers={handleCsvHeader()}
            />
        </Fragment>
    )
}

export default DownloadCsv
