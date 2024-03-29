import React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import { Button } from '@mui/material'
import { styled } from '@mui/system'
import { handleOutputName } from 'app/utils/utils'
import axios from 'axios'
import fileDownload from 'js-file-download'

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    marginBottom: '10px',
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const DownloadPng = ({
    currType,
    image,
    loading,
    setLoading,
    startDate,
    endDate,
    location,
    frequency,
    selectedValue,
    name,
    ctdType,
    ctdRightDate,
    meteGrahphType,
}) => {
    const outputName = handleOutputName(
        location,
        startDate,
        endDate,
        selectedValue
    )

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

    const DownloadPNG = () => {
        if (currType === 'SPDF') {
            const linkSource = `data:image/jpeg;base64,${image}`
            const downloadLink = document.createElement('a')
            downloadLink.href = linkSource
            downloadLink.download = `${outputName}.png`
            downloadLink.click()
        } else {
            if (selectedValue === 'CTD') {
                currType = 'CTD'
            }
            setLoading(true)

            if (location === 'oregon_shelf' || location === 'oregon_offshore') {
                startDate = processDateForWindRain(startDate)
                endDate = processDateForWindRain(endDate)
            }

            axios({
                method: 'post',
                url: '/api/downloadPng',
                responseType: 'blob',
                data: {
                    startDate,
                    endDate,
                    location,
                    currType,
                    frequency,
                    ctdType,
                    ctdRightDate,
                    meteGrahphType,
                },
            }).then((res) => {
                setLoading(false)
                fileDownload(res.data, `${outputName}.png`)
            })
        }
    }

    return (
        <StyledButton
            variant="contained"
            disabled={loading === true}
            // disabled={true}
            onClick={DownloadPNG}
        >
            <DownloadIcon sx={{ mr: 1 }} />
            {name}
        </StyledButton>
    )
}

export default DownloadPng
