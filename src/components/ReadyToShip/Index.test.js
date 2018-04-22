import React from 'react'
import { shallow, mount } from 'enzyme'
import { Index } from './Index'
import { QA_STATUS } from '../../constants'

it('should render Send shipment button', () => {
  const props = {}
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-send-shipment').exists()).toEqual(true)
})

it('Send shipment button should be enabled when there is robots whose qaStatus is READY_TO_SHIP', () => {
  const props = {
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-send-shipment').prop('disabled')).toEqual(false)
})

it('sendShipment action creator should be called when Send shipment button clicked', () => {
  const props = {
    sendShipment: jest.fn(),
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  wrapper.find('.btn-send-shipment').simulate('click')
  expect(props.sendShipment.mock.calls.length).toEqual(1)
})

it('sendShipmentSuccess prop should call resetSendShipmentSuccess function prop and history.push', () => {
  const props = {
    sendShipmentSuccess: true,
    resetSendShipmentSuccess: jest.fn(),
    history: {
      push: jest.fn()
    }
  }
  const wrapper = shallow(<Index {...props} />)
  wrapper.setProps(props)
  expect(props.resetSendShipmentSuccess.mock.calls.length).toEqual(1)
  expect(props.history.push.mock.calls.length).toEqual(1)
})
