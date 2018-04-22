import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import fetchMock from 'fetch-mock'
import { QA_STATUS } from '../constants'
import {
  actionCreators,
  reducer,
  initialState,
  requestRobotsForQA,
  successRobotsForQA,
  successExtinguish,
  failExtinguish,
  successRecycle,
  failRecycle,
  resetRecycleSuccess,
  completeQA,
  resetCompleteQaSuccess,
  addToShipment,
  removeFromShipment,
  successSendShipment,
  resetSendShipmentSuccess,
  requestExtinguish,
  requestRecycle,
  requestSendShipment,
  failRobotsForQA,
  failSendShipment,
  completeQaSuccess
} from './QualityAssurance'

describe('actionCreators', () => {
  const mockedDispatch = payload => payload
  const mockedGetState = jest.fn()

  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should have the properties', () => {
    expect(actionCreators).toHaveProperty('getRobotsForQA')
    expect(actionCreators).toHaveProperty('extinguishRobot')
    expect(actionCreators).toHaveProperty('recycleRobots')
    expect(actionCreators).toHaveProperty('resetRecycleSuccess')
  })

  it('getRobotsForQA action creator should create successRobotsForQA type action', async () => {
    fetchMock.getOnce('/robots.json', [])

    const action = await actionCreators.getRobotsForQA()(
      mockedDispatch,
      mockedGetState
    )

    expect(action).toEqual({ type: successRobotsForQA, robots: [] })
  })

  it('extinguishRobot action creator should create successExtinguish type action', async () => {
    fetchMock.post('/robots/1/extinguish.json', 'true')

    const action = await actionCreators.extinguishRobot(1)(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(successExtinguish)
  })

  it('extinguishRobot action creator should create failExtinguish type action', async () => {
    fetchMock.post('/robots/1/extinguish.json', 'true')

    const action = await actionCreators.extinguishRobot(10)(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(failExtinguish)
  })

  it('recycleRobots action creator should create successRecycle type action', async () => {
    fetchMock.post('/robots/recycle.json', 'true')

    const action = await actionCreators.recycleRobots([1, 2, 3])(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(successRecycle)
  })

  it('resetRecycleSuccess action creator should create resetRecycleSuccess type action', async () => {
    const action = await actionCreators.resetRecycleSuccess()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(resetRecycleSuccess)
  })

  it('completeQA action creator should create completeQA type action', async () => {
    const action = await actionCreators.completeQA()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(completeQA)
  })

  it('resetCompleteQaSuccess action creator should create resetCompleteQaSuccess type action', async () => {
    const action = await actionCreators.resetCompleteQaSuccess()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(resetCompleteQaSuccess)
  })

  it('addToShipment action creator should create addToShipment type action', async () => {
    const action = await actionCreators.addToShipment()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(addToShipment)
  })

  it('removeFromShipment action creator should create removeFromShipment type action', async () => {
    const action = await actionCreators.removeFromShipment()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(removeFromShipment)
  })

  it('sendShipment action creator should create successSendShipment type action', async () => {
    fetchMock.put('/shipments/create', 'true')

    const action = await actionCreators.sendShipment([1, 2, 3])(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(successSendShipment)
  })

  it('resetSendShipmentSuccess action creator should create resetSendShipmentSuccess type action', async () => {
    const action = await actionCreators.resetSendShipmentSuccess()(
      mockedDispatch,
      mockedGetState
    )

    expect(action.type).toEqual(resetSendShipmentSuccess)
  })
})

describe('reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toEqual({
      robots: [],
      isLoading: false,
      error: null,
      recycleSuccess: false,
      completeQaSuccess: false,
      sendShipmentSuccess: false
    })
  })

  describe('should handle successRobotsForQA action type', () => {
    it('should remove duplicates', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1 }, { id: 1 }]
      })
      expect(state.robots.length).toEqual(1)
    })

    it('should sort by id in ascending order', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 2 }, { id: 1 }]
      })
      expect(state.robots[0].id).toEqual(1)
    })

    it('should have qaStatus as READY_FOR_QA', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1 }]
      })
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.READY_FOR_QA)
    })
  })

  describe('should have correct shouldExtinguish boolean value - checking extinguish logic', () => {
    it('shouldExtinguish should be true when having sentience and status is on fire', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [
          {
            id: 1,
            configuration: { hasSentience: true },
            statuses: ['on fire']
          }
        ]
      })
      expect(state.robots[0].shouldExtinguish).toEqual(true)
    })

    it('shouldExtinguish should be false only when status is on fire', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [
          {
            id: 1,
            statuses: ['on fire']
          }
        ]
      })
      expect(state.robots[0].shouldExtinguish).toEqual(false)
    })
  })

  describe('should have correct shouldRecycle boolean value - checking recycle logic', () => {
    it('shouldRecycle should be false when rotors are 5', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, configuration: { numberOfRotors: 5 } }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(false)
    })

    it('shouldRecycle should be true when rotors fewer than 3', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, configuration: { numberOfRotors: 2 } }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when rotors greater than 8', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, configuration: { numberOfRotors: 9 } }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when color is blue', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, configuration: { colour: 'blue' } }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when having wheels and tracks', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, configuration: { hasWheels: true, hasTracks: true } }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when having wheels and rusty', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [
          { id: 1, configuration: { hasWheels: true }, statuses: ['rusty'] }
        ]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when having sentience and loose screws', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [
          {
            id: 1,
            configuration: { hasSentience: true },
            statuses: ['loose screws']
          }
        ]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })

    it('shouldRecycle should be true when status is on fire', () => {
      const state = reducer(undefined, {
        type: successRobotsForQA,
        robots: [{ id: 1, statuses: ['on fire'] }]
      })
      expect(state.robots[0].shouldRecycle).toEqual(true)
    })
  })

  describe('should handle successExtinguish action type', () => {
    it('should return all the robots except robots extinguished', () => {
      const state = reducer(
        { robots: [{ id: 1 }, { id: 2 }] },
        {
          type: successExtinguish,
          id: 1
        }
      )
      expect(_.findIndex(state.robots, { id: 1 })).toEqual(-1)
    })

    it('isLoading should be false', () => {
      const state = reducer(undefined, { type: successExtinguish })
      expect(state.isLoading).toEqual(false)
    })
  })

  describe('should handle successRecycle action type', () => {
    it('should return all the robots except robots recycled', () => {
      const state = reducer(
        { robots: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        {
          type: successRecycle,
          ids: [1, 2]
        }
      )
      expect(_.findIndex(state.robots, { id: 1 })).toEqual(-1)
      expect(_.findIndex(state.robots, { id: 2 })).toEqual(-1)
      expect(_.findIndex(state.robots, { id: 3 })).toEqual(0)
    })

    it('isLoading should be false', () => {
      const state = reducer(undefined, { type: successRecycle })
      expect(state.isLoading).toEqual(false)
    })
  })

  describe('should handle completeQA action type', () => {
    it('should return qaStatus as FACTORY_SECOND when rusty - checking factory second logic', () => {
      const state = reducer(
        { robots: [{ id: 1, statuses: ['rusty'] }] },
        { type: completeQA, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.FACTORY_SECOND)
    })

    it('should return qaStatus as FACTORY_SECOND when loose screws - checking factory second logic', () => {
      const state = reducer(
        { robots: [{ id: 1, statuses: ['loose screws'] }] },
        { type: completeQA, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.FACTORY_SECOND)
    })

    it('should return qaStatus as FACTORY_SECOND when paint scratched - checking factory second logic', () => {
      const state = reducer(
        { robots: [{ id: 1, statuses: ['paint scratched'] }] },
        { type: completeQA, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.FACTORY_SECOND)
    })

    it('completeQaSuccess should be true', () => {
      const state = reducer(undefined, { type: completeQA })
      expect(state.completeQaSuccess).toEqual(true)
    })
  })

  describe('should handle addToShipment action type', () => {
    it('should update qaStatus to READY_TO_SHIP', () => {
      const state = reducer(
        { robots: [{ id: 1 }, { id: 2 }] },
        { type: addToShipment, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.READY_TO_SHIP)
      expect(state.robots[1].qaStatus).toEqual(undefined)
    })
  })

  describe('should handle successSendShipment action type', () => {
    it('isLoading should be false', () => {
      const state = reducer(undefined, { type: successSendShipment })
      expect(state.isLoading).toEqual(false)
    })

    it('sendShipmentSuccess should be true', () => {
      const state = reducer(undefined, { type: successSendShipment })
      expect(state.sendShipmentSuccess).toEqual(true)
    })
  })

  describe('should handle removeFromShipment action type', () => {
    it('should change qaStatus to FACTORY_SECOND', () => {
      const state = reducer(
        { robots: [{ id: 1, statuses: ['rusty'] }] },
        { type: removeFromShipment, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.FACTORY_SECOND)
    })

    it('should change qaStatus to PASSED_QA', () => {
      const state = reducer(
        { robots: [{ id: 1 }] },
        { type: removeFromShipment, id: 1 }
      )
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.PASSED_QA)
    })
  })

  describe('should handle all request action type', () => {
    it('requestRobotsForQA action type', () => {
      const state = reducer(undefined, { type: requestRobotsForQA })
      expect(state.isLoading).toEqual(true)
    })
    it('requestExtinguish action type', () => {
      const state = reducer(undefined, { type: requestExtinguish })
      expect(state.isLoading).toEqual(true)
    })
    it('requestRecycle action type', () => {
      const state = reducer(undefined, { type: requestRecycle })
      expect(state.isLoading).toEqual(true)
    })
    it('requestSendShipment action type', () => {
      const state = reducer(undefined, { type: requestSendShipment })
      expect(state.isLoading).toEqual(true)
    })
  })

  describe('should handle all fail action type', () => {
    it('failRobotsForQA action type', () => {
      const state = reducer(undefined, { type: failRobotsForQA })
      expect(state.isLoading).toEqual(false)
    })
    it('failExtinguish action type', () => {
      const state = reducer(undefined, { type: failExtinguish })
      expect(state.isLoading).toEqual(false)
    })
    it('failRecycle action type', () => {
      const state = reducer(undefined, { type: failRecycle })
      expect(state.isLoading).toEqual(false)
    })
    it('failSendShipment action type', () => {
      const state = reducer(undefined, { type: failSendShipment })
      expect(state.isLoading).toEqual(false)
    })
  })

  describe('should handle all reseting action type', () => {
    it('resetRecycleSuccess action type', () => {
      const state = reducer(undefined, { type: resetRecycleSuccess })
      expect(state.recycleSuccess).toEqual(false)
    })

    it('resetCompleteQaSuccess action type', () => {
      const state = reducer(undefined, { type: resetCompleteQaSuccess })
      expect(state.completeQaSuccess).toEqual(false)
    })

    it('resetSendShipmentSuccess action type', () => {
      const state = reducer(undefined, { type: resetSendShipmentSuccess })
      expect(state.sendShipmentSuccess).toEqual(false)
    })
  })
})
