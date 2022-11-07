import {
    GET_INIT_GRAPH, GET_UPDATE_GRAPH, GET_CTP_INIT_GRAPH, GET_UPDATE_CTD_GRAPH, GET_CTP_INIT_GRAPH_LINE, GET_WIND_RAIN_GRAPH
} from '../actions/GraphActions'

const initialState = {
    initSpecGraph: {},
    initCtpGraph: {},
    initCtpGraphLine: {},
    initWindRainGraph: {},
    csv: {}
}

const GraphReducer = function (state = initialState, action) {
    switch (action.type)
    {
        case GET_INIT_GRAPH: {
            return {
                ...state,
                initSpecGraph: { ...action.payload }
            }
        }
        case GET_CTP_INIT_GRAPH: {
            return {
                ...state,
                initCtpGraph: { ...action.payload }
            }
        }
        case GET_CTP_INIT_GRAPH_LINE: {
            return {
                ...state,
                initCtpGraphLine: { ...action.payload }
            }
        }
        case GET_UPDATE_GRAPH: {
            return {
                ...state,
                initSpecGraph: { ...action.payload }
            }
        }
        case GET_UPDATE_CTD_GRAPH: {
            return {
                ...state,
                initCtpGraph: { ...action.payload }
            }
        }
        case GET_WIND_RAIN_GRAPH: {
            return {
                ...state,
                initWindRainGraph: { ...action.payload }
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
}

export default GraphReducer
