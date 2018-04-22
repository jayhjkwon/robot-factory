import _ from 'lodash'
import qaService from '../services/QualityAssuranceService'
import { QA_STATUS } from '../constants'

export const requestRobotsForQA = 'REQUEST_ROBOTS_FOR_QA'
export const successRobotsForQA = 'SUCCESS_ROBOTS_FOR_QA'
export const failRobotsForQA = 'FAIL_ROBOTS_FOR_QA'
export const useCachedRobots = 'USE_CACHED_ROBOTS'
export const requestExtinguish = 'REQUEST_EXTINGUISH'
export const successExtinguish = 'SUCCESS_EXTINGUISH'
export const failExtinguish = 'FAIL_EXTINGUISH'
export const requestRecycle = 'REQUEST_RECYCLE'
export const successRecycle = 'SUCCESS_RECYCLE'
export const failRecycle = 'FAIL_RECYCLE'
export const resetRecycleSuccess = 'RESET_RECYCLE_SUCCESS'
export const completeQA = 'COMPLETE_QA'
export const resetCompleteQaSuccess = 'RESET_COMPLTE_QA_SUCCESS'
export const addToShipment = 'ADD_TO_SHIPMENT'
export const removeFromShipment = 'REMOVE_FROM_SHIPMENT'
export const requestSendShipment = 'REQUEST_SEND_SHIPMENT'
export const successSendShipment = 'SUCCESS_SEND_SHIPMENT'
export const resetSendShipmentSuccess = 'RESET_SEND_SHIPMENT_SUCCESS'
export const failSendShipment = 'FAIL_SEND_SHIPMENT'

export const initialState = {
  robots: [],
  isLoading: false,
  error: null,
  recycleSuccess: false,
  completeQaSuccess: false,
  sendShipmentSuccess: false
}

export const actionCreators = {
  getRobotsForQA: () => async (dispatch, getState) => {
    // use cached robots if exists
    const rootState = getState()
    const state = rootState && rootState.qualityAssurance
    if (state && state.robots && state.robots.length >= 1) {
      return dispatch({ type: useCachedRobots })
    }

    dispatch({ type: requestRobotsForQA })

    try {
      const robots = await qaService.getRobotsForQA()
      return dispatch({ type: successRobotsForQA, robots })
    } catch (error) {
      return dispatch({ type: failRobotsForQA, error })
    }
  },

  extinguishRobot: id => async dispatch => {
    dispatch({ type: requestExtinguish })

    try {
      const response = await qaService.extinguishRobot(id)
      return dispatch({ type: successExtinguish, ...response, id })
    } catch (error) {
      return dispatch({ type: failExtinguish, error })
    }
  },

  recycleRobots: ids => async dispatch => {
    dispatch({ type: requestRecycle })

    try {
      const response = await qaService.recycleRobots(ids)
      return dispatch({ type: successRecycle, ...response, ids })
    } catch (error) {
      return dispatch({ type: failRecycle, error })
    }
  },

  resetRecycleSuccess: () => dispatch => {
    return dispatch({ type: resetRecycleSuccess })
  },

  completeQA: () => dispatch => {
    return dispatch({ type: completeQA })
  },

  resetCompleteQaSuccess: () => dispatch => {
    return dispatch({ type: resetCompleteQaSuccess })
  },

  addToShipment: id => dispatch => {
    return dispatch({ type: addToShipment, id })
  },

  removeFromShipment: id => dispatch => {
    return dispatch({ type: removeFromShipment, id })
  },

  sendShipment: () => async (dispatch, getState) => {
    dispatch({ type: requestSendShipment })

    try {
      const rootState = getState()
      const ids =
        rootState &&
        _.chain(getState().qualityAssurance.robots)
          .filter(robot => robot.qaStatus === QA_STATUS.READY_TO_SHIP)
          .map(robot => robot.id)
          .value()
      await qaService.sendShipment(ids)
      return dispatch({ type: successSendShipment, ids })
    } catch (error) {
      console.log(error)
      return dispatch({ type: failSendShipment, error })
    }
  },

  resetSendShipmentSuccess: () => dispatch => {
    return dispatch({ type: resetSendShipmentSuccess })
  }
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case successRobotsForQA: {
      const robots = _.chain(action.robots)
        .uniqBy(robot => robot.id)
        .map(robot => ({
          ...robot,
          qaStatus: QA_STATUS.READY_FOR_QA,
          shouldRecycle: shouldRecycle(robot),
          shouldExtinguish: shouldExtinguish(robot)
        }))
        .orderBy(['id'], ['asc'])
        .value()
      return {
        ...state,
        robots,
        isLoading: false
      }
    }

    case successExtinguish: {
      return {
        ...state,
        isLoading: false,
        robots: state.robots.filter(robot => robot.id !== action.id)
      }
    }

    case successRecycle: {
      return {
        ...state,
        isLoading: false,
        recycleSuccess: true,
        robots: state.robots.filter(robot => !_.includes(action.ids, robot.id))
      }
    }

    case resetRecycleSuccess: {
      return {
        ...state,
        recycleSuccess: false
      }
    }

    case completeQA: {
      const robots = state.robots.map(robot => ({
        ...robot,
        qaStatus: isFactorySecond(robot)
          ? QA_STATUS.FACTORY_SECOND
          : QA_STATUS.PASSED_QA
      }))

      return {
        ...state,
        completeQaSuccess: true,
        robots
      }
    }

    case resetCompleteQaSuccess: {
      return {
        ...state,
        completeQaSuccess: false
      }
    }

    case addToShipment: {
      const robots = state.robots.map(robot => ({
        ...robot,
        qaStatus:
          robot.id === action.id ? QA_STATUS.READY_TO_SHIP : robot.qaStatus
      }))

      return {
        ...state,
        robots
      }
    }

    case successSendShipment: {
      const robots = state.robots.filter(
        robot => action.ids.indexOf(robot.id) < 0
      )

      return {
        ...state,
        isLoading: false,
        sendShipmentSuccess: true,
        robots
      }
    }

    case resetSendShipmentSuccess: {
      return {
        ...state,
        sendShipmentSuccess: false
      }
    }

    case removeFromShipment: {
      const robots = state.robots.map(robot => ({
        ...robot,
        qaStatus:
          robot.id === action.id
            ? isFactorySecond(robot)
              ? QA_STATUS.FACTORY_SECOND
              : QA_STATUS.PASSED_QA
            : robot.qaStatus
      }))

      return {
        ...state,
        robots
      }
    }

    case requestRobotsForQA:
    case requestExtinguish:
    case requestRecycle:
    case requestSendShipment: {
      return {
        ...state,
        isLoading: true
      }
    }

    case failRobotsForQA:
    case failExtinguish:
    case failRecycle:
    case failSendShipment: {
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

const shouldRecycle = robot => {
  const rotors =
    robot.configuration && robot.configuration.numberOfRotors
      ? robot.configuration.numberOfRotors
      : 0
  const color = robot.configuration && robot.configuration.colour
  const wheels = robot.configuration && robot.configuration.hasWheels
  const tracks = robot.configuration && robot.configuration.hasTracks
  const statuses = robot.statuses
  const sentience = robot.hasSentience

  if (rotors < 3 || rotors > 8) return true
  if (rotors > 0 && color === 'blue') return true
  if (wheels && tracks) return true
  if (wheels && _.includes(statuses, 'rusty')) return true
  if (sentience && _.includes(statuses, 'loose screws')) return true
  if (_.includes(statuses, 'on fire')) return true

  return false
}

const shouldExtinguish = robot => {
  return !!(
    robot.configuration &&
    robot.configuration.hasSentience &&
    robot.statuses &&
    robot.statuses.indexOf('on fire') >= 0
  )
}

const isFactorySecond = robot => {
  return !!(
    robot.statuses &&
    robot.statuses.join().match(/(rusty|loose screws|paint scratched)/)
  )
}
