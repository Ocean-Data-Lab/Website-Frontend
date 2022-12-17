import React, { Fragment } from 'react'
import axios from 'axios'
import { Button } from '@mui/material'
import { styled } from '@mui/system'
import DownloadIcon from '@mui/icons-material/Download'

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    backgroundColor: '#008255',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const DownloadCsv = ({
    error,
    startDate,
    endDate,
    location,
    frequency,
    currType,
    setLoading,
    currentLocation,
    selectedValue,
    loading,
    meteGrahphType,
}) => {
    const removeFirstZeroInString = (str) => {
        if (str.charAt(0) === '0') {
            str = str.slice(1)
        }
        return str
    }

    const processDateForWindRain = (dataString) => {
        let dataLst = dataString.split('-')
        return {
            year: dataLst[0],
            month: removeFirstZeroInString(dataLst[1]),
            date: removeFirstZeroInString(dataLst[2]),
        }
    }

    const downloadCSV = () => {
        setLoading(true)

        if (location === 'oregon_shelf' || location === 'oregon_offshore') {
            startDate = processDateForWindRain(startDate)
            endDate = processDateForWindRain(endDate)
        }

        axios
            .post(
                '/api/downloads',
                {
                    startDate,
                    endDate,
                    location,
                    currType,
                    frequency,
                    selectedValue,
                    meteGrahphType,
                },
                { responseType: 'blob' }
            )
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url

                link.setAttribute(
                    'download',
                    currType +
                        '_' +
                        location +
                        '-_' +
                        startDate +
                        '-_' +
                        endDate +
                        '.csv'
                )
                document.body.appendChild(link)
                link.click()
                setLoading(false)
            })
    }

    return (
        <Fragment>
            <StyledButton
                disabled={error === 'error' || loading ? true : false}
                variant="contained"
                component="span"
                onClick={downloadCSV}
                sx={{ backgroundColor: '#008255' }}
            >
                <DownloadIcon sx={{ mr: 1 }} />
                CSV
            </StyledButton>
        </Fragment>
    )
}

export default DownloadCsv
