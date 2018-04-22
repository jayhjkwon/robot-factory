import React from 'react'
import { shallow, mount } from 'enzyme'
import RobotList, { StyledLoading } from './RobotList'
import RobotItem from './RobotItem'
import styled from 'styled-components'
import YesIcon from './YesIcon'
import { QA_STATUS } from '../../constants'
import { Button } from 'react-bootstrap'

it('should render Extinguish header column when statusToFilter is READY_FOR_QA', () => {
  const props = {
    statusToFilter: QA_STATUS.READY_FOR_QA,
    shouldExtinguish: true,
    shouldRecycle: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find('.header-extinguish').exists()).toEqual(true)
})

it('should render Recycle header column when statusToFilter is READY_FOR_QA', () => {
  const props = {
    statusToFilter: QA_STATUS.READY_FOR_QA,
    shouldExtinguish: true,
    shouldRecycle: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find('.header-recycle').exists()).toEqual(true)
})

it('should render add to shipment header column when statusToFilter is FACTORY_SECOND', () => {
  const props = {
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: true,
    shouldRecycle: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find('.header-add-to-shipment').exists()).toEqual(true)
})

it('should render add to shipment header column when statusToFilter is PASSED_QA', () => {
  const props = {
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    shouldExtinguish: true,
    shouldRecycle: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find('.header-add-to-shipment').exists()).toEqual(true)
})

it('should render Remove from shipment header column when statusToFilter is READY_TO_SHIP', () => {
  const props = {
    statusToFilter: QA_STATUS.READY_TO_SHIP,
    shouldExtinguish: true,
    shouldRecycle: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find('.header-remove-from-shipment').exists()).toEqual(true)
})

it('should only render robots whose qaStatus is "READY_FOR_QA"', () => {
  const props = {
    statusToFilter: QA_STATUS.READY_FOR_QA,
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.READY_FOR_QA
      },
      {
        id: 2,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(RobotItem).length).toEqual(1)
})

it('should only render robots whose qaStatus is "FACTORY_SECOND"', () => {
  const props = {
    statusToFilter: QA_STATUS.FACTORY_SECOND,
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.FACTORY_SECOND
      },
      {
        id: 2,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(RobotItem).length).toEqual(1)
})

it('should only render robots whose qaStatus is "PASSED_QA"', () => {
  const props = {
    statusToFilter: QA_STATUS.PASSED_QA,
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.PASSED_QA
      },
      {
        id: 2,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(RobotItem).length).toEqual(1)
})

it('should only render robots whose qaStatus is "READY_TO_SHIP"', () => {
  const props = {
    statusToFilter: QA_STATUS.PASSED_QA,
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.PASSED_QA
      },
      {
        id: 2,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(RobotItem).length).toEqual(1)
})

it('should only render robots whose qaStatus is "SENT_SHIPMENT"', () => {
  const props = {
    statusToFilter: QA_STATUS.SENT_SHIPMENT,
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.SENT_SHIPMENT
      },
      {
        id: 2,
        qaStatus: QA_STATUS.READY_TO_SHIP
      }
    ]
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(RobotItem).length).toEqual(1)
})

it('should render Loading component', () => {
  const props = {
    isLoading: true
  }
  const wrapper = shallow(<RobotList {...props} />)
  expect(wrapper.find(StyledLoading).exists()).toEqual(true)
})
