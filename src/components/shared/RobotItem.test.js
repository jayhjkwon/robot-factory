import React from 'react'
import { shallow, mount } from 'enzyme'
import RobotItem from './RobotItem'
import styled from 'styled-components'
import YesIcon from './YesIcon'
import { QA_STATUS } from '../../constants'
import { Button } from 'react-bootstrap'

it('should render robot data', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.READY_FOR_QA,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)
  expect(wrapper.find('td.robot-id').text()).toEqual('1')
  expect(wrapper.find('td.robot-name').text()).toEqual('Jay')
  expect(
    wrapper
      .find('.has-sentience')
      .find(YesIcon)
      .exists()
  ).toEqual(true)
  expect(
    wrapper
      .find('.has-wheels')
      .find(YesIcon)
      .exists()
  ).toEqual(false)
  expect(
    wrapper
      .find('.has-tracks')
      .find(YesIcon)
      .exists()
  ).toEqual(true)
  expect(wrapper.find('td.rotors').text()).toEqual('5')
  expect(wrapper.find('td.color').text()).toEqual('red')
  expect(wrapper.find('td.statuses').text()).toEqual('rusty, on fire')
  expect(
    wrapper
      .find('.should-extinguish')
      .find(Button)
      .exists()
  ).toEqual(true)
  expect(
    wrapper
      .find('.should-recycle')
      .find(YesIcon)
      .exists()
  ).toEqual(true)
  expect(
    wrapper
      .find('.add-to-shipment')
      .find(Button)
      .exists()
  ).toEqual(false)
  expect(
    wrapper
      .find('.remove-from-shipment')
      .find(Button)
      .exists()
  ).toEqual(false)
})

it('should render add to shipment button when statusToFilter is FACTORY_SECOND', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(
    wrapper
      .find('.add-to-shipment')
      .find(Button)
      .exists()
  ).toEqual(true)
})

it('should render add to shipment button when statusToFilter is PASSED_QA', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.PASSED_QA,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(
    wrapper
      .find('.add-to-shipment')
      .find(Button)
      .exists()
  ).toEqual(true)
})

it('should render remove from shipment button when statusToFilter is READY_TO_SHIP', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.READY_TO_SHIP,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(
    wrapper
      .find('.remove-from-shipment')
      .find(Button)
      .exists()
  ).toEqual(true)
})

it('should not render extinguish button when statusToFilter is not READY_FOR_QA', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(wrapper.find('.should-extinguish').exists()).toEqual(false)
})

it('should not render extinguish button when shouldExtinguish is false', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: false,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(wrapper.find('.should-extinguish').exists()).toEqual(false)
})

it('should not render recycle icon when statusToFilter is not READY_FOR_QA', () => {
  const props = {
    id: 1,
    name: 'Jay',
    configuration: {
      hasSentience: true,
      hasWheels: false,
      hasTracks: true,
      numberOfRotors: 5,
      colour: 'red'
    },
    statuses: ['rusty', 'on fire'],
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: true,
    shouldRecycle: true
  }

  const wrapper = shallow(<RobotItem {...props} />)

  expect(wrapper.find('.should-recycle').exists()).toEqual(false)
})
