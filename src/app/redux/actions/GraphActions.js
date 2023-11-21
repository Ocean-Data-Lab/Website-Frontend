import axios from 'axios'

export const GET_INIT_GRAPH = 'GET_INIT_GRAPH'
export const GET_CTP_INIT_GRAPH = 'GET_CTP_INIT_GRAPH'
export const GET_UPDATE_GRAPH = 'GET_UPDATE_GRAPH'
export const GET_UPDATE_ST_GRAPH = 'GET_UPDATE_ST_GRAPH'
export const GET_UPDATE_CTD_GRAPH = "GET_UPDATE_CTD_GRAPH"
export const GET_CTP_INIT_GRAPH_LINE = "GET_CTP_INIT_GRAPH_LINE"
export const GET_WIND_RAIN_GRAPH = "GET_WIND_RAIN_GRAPH"

export const getInitialGraph = (startDate, endDate, location) => (dispatch) => {
    axios
        .post('/api/getInitGraph', { startDate, endDate, location })
        .then((res) => {
            dispatch({
                type: GET_INIT_GRAPH,
                payload: res.data,
            })
        })
}

export const getCTPInitialGraph = (location, startDate, endDate) => (dispatch) => {
    axios
        .post('/api/getCTP', { location, startDate, endDate })
        .then((res) => {
            dispatch({
                type: GET_CTP_INIT_GRAPH,
                payload: res.data,
            })
        })
}

export const getCTPInitialGraphLine = (location, date) => (dispatch) => {
    axios
        .post('/api/getCTPLine', { location, date })
        .then((res) => {
            dispatch({
                type: GET_CTP_INIT_GRAPH_LINE,
                payload: res.data,
            })
        })
}

export const getUpdatedGraph = (startDate, endDate, graphType, location, frequency) => (dispatch) => {
    axios
        .post('/api/getUpdatedGraph', { startDate, endDate, graphType, location, frequency })
        .then((res) => {
            dispatch({
                type: GET_UPDATE_GRAPH,
                payload: res.data,
            })
        })
}

export const getSTUpdatedGraph = (startDate, endDate, graphType, location, locType, overlap, nperseg, avg_time) => (dispatch) => {
    axios
        .post('/api/getSTUpdatedGraph', { startDate, endDate, graphType, location, locType, overlap, nperseg, avg_time })
        .then((res) => {
            dispatch({
                type: GET_UPDATE_ST_GRAPH,
                payload: res.data,
            })
        })
}

export const getUpdatedCtdGraph = (location, startDate, endDate) => (dispatch) => {
    axios
        .post('/api/getUpdateCtpGraph', { location, startDate, endDate })
        .then((res) => {
            dispatch({
                type: GET_UPDATE_CTD_GRAPH,
                payload: res.data,
            })
        })
}

export const getWindRainGraph = (graphType, startDate, endDate, location, windSpeedType) => (dispatch) => {
    axios
        .post('/api/getWindRainGraph', { graphType, startDate, endDate, location, windSpeedType })
        .then((res) => {
            dispatch({
                type: GET_WIND_RAIN_GRAPH,
                payload: res.data,
            })
        })
}
