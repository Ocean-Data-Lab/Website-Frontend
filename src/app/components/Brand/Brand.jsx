import React from 'react'
import { Span } from '../Typography'
import { styled, Box } from '@mui/system'
import { H4 } from 'app/components/Typography'

const BrandRoot = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

const StyledSpan = styled(Span)(() => ({
    fontSize: 18,
    marginLeft: '.5rem',
}))

const LabLogo = styled('img')(() => ({
    width: '50px',
    marginRight: '6px',
    marginTop: '-1px',
}))

const Labtitle = styled(H4)(() => ({
    width: '160px',
    color: '#107EBC',
    fontWeight: 400,
    fontSize: '15px',
    marginLeft: '-5px',
}))

const IMG = styled('img')(({ theme }) => ({
    width: '240px',
    marginLeft: '15px',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))

const Brand = ({ children }) => {
    return (
        <BrandRoot sx={{ py: 1 }}>
            <Box display="flex" alignItems="center">
                {/* <MatxLogo /> */}
                <LabLogo src={'/assets/images/logos/one.png'} />
                <StyledSpan className="sidenavHoverShow">
                    <Labtitle>Ocean Noise Explorer</Labtitle>
                </StyledSpan>
                <IMG src={'/assets/images/logos/uw.png'} />
            </Box>
            <Box className="sidenavHoverShow">{children || null}</Box>
        </BrandRoot>
    )
}

export default Brand
