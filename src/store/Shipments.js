import _ from 'lodash'
import qaService from '../services/QualityAssuranceService'
import { QA_STATUS } from '../constants'

export const requestShipmentList = 'REQUEST_SHIPMENT_LIST'
export const successShipmentList = 'SUCCESS_SHIPMENT_LIST'
export const failShipmentList = 'FAIL_SHIPMENT_LIST'

export const initialState = {
  robots: [],
  isLoading: false,
  error: null
}

export const actionCreators = {
  getShipments: () => async (dispatch, getState) => {
    dispatch({ type: requestShipmentList })

    try {
      const robots = await qaService.getShipments()
      return dispatch({ type: successShipmentList, robots })
    } catch (error) {
      return dispatch({ type: failShipmentList, error })
    }
  }
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case successShipmentList: {
      const robots = _.chain(action.robots)
        .uniqBy(robot => robot.id)
        .map(robot => ({
          ...robot,
          qaStatus: QA_STATUS.SENT_SHIPMENT
        }))
        .orderBy(['id'], ['asc'])
        .value()
      return {
        ...state,
        robots,
        isLoading: false
      }
    }

    case requestShipmentList: {
      return {
        ...state,
        isLoading: true
      }
    }

    case failShipmentList: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }

    default:
      return state
  }
}
