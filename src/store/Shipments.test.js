import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import fetchMock from 'fetch-mock'
import { QA_STATUS } from '../constants'
import {
  actionCreators,
  reducer,
  initialState,
  requestShipmentList,
  successShipmentList,
  failShipmentList
} from './Shipments'

describe('actionCreators', () => {
  const mockedDispatch = payload => payload
  const mockedGetState = jest.fn()

  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should have the properties', () => {
    expect(actionCreators).toHaveProperty('getShipments')
  })

  it('getShipments action creator should create successShipmentList type action', async () => {
    fetchMock.getOnce('http://localhost:3001/shipments.json', [])

    const action = await actionCreators.getShipments()(
      mockedDispatch,
      mockedGetState
    )

    expect(action).toEqual({ type: successShipmentList, robots: [] })
  })
})

describe('reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toEqual({
      robots: [],
      isLoading: false,
      error: null
    })
  })

  describe('should handle successShipmentList action type', () => {
    it('should remove duplicates', () => {
      const state = reducer(undefined, {
        type: successShipmentList,
        robots: [{ id: 1 }, { id: 1 }]
      })
      expect(state.robots.length).toEqual(1)
    })

    it('should sort by id in ascending order', () => {
      const state = reducer(undefined, {
        type: successShipmentList,
        robots: [{ id: 2 }, { id: 1 }]
      })
      expect(state.robots[0].id).toEqual(1)
    })

    it('should have qaStatus as SENT_SHIPMENT', () => {
      const state = reducer(undefined, {
        type: successShipmentList,
        robots: [{ id: 1 }]
      })
      expect(state.robots[0].qaStatus).toEqual(QA_STATUS.SENT_SHIPMENT)
    })
  })

  describe('should handle all request action type', () => {
    it('requestShipmentList action type', () => {
      const state = reducer(undefined, { type: requestShipmentList })
      expect(state.isLoading).toEqual(true)
    })
  })

  describe('should handle all fail action type', () => {
    it('failShipmentList action type', () => {
      const state = reducer(undefined, { type: failShipmentList })
      expect(state.isLoading).toEqual(false)
    })
  })
})
