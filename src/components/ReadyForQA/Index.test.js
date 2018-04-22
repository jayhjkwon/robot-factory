import React from 'react'
import { shallow, mount } from 'enzyme'
import { Index } from './Index'
import { QA_STATUS } from '../../constants'

it('getRobotsForQA function should be called after loading component', () => {
  const props = {
    getRobotsForQA: jest.fn()
  }
  const wrapper = shallow(<Index {...props} />)
  expect(props.getRobotsForQA.mock.calls.length).toEqual(1)
})

it('should render Recycle robots button', () => {
  const props = {
    getRobotsForQA: jest.fn()
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-recycle-robots').exists()).toEqual(true)
})

it('Recycle robots button should be disabled when there is no robots whose shouldRecycle is true', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    robots: [
      {
        id: 1,
        shouldRecycle: false
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-recycle-robots').prop('disabled')).toEqual(true)
})

it('Recycle robots button should be enabled when there is robots whose shouldRecycle is true', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    robots: [
      {
        id: 1,
        shouldRecycle: true
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-recycle-robots').prop('disabled')).toEqual(false)
})

it('recycleRobots action creator should be called when Recycle robots button clicked', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    recycleRobots: jest.fn(),
    robots: [
      {
        id: 1,
        shouldRecycle: true
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  wrapper.find('.btn-recycle-robots').simulate('click')
  expect(props.recycleRobots.mock.calls.length).toEqual(1)
})

it('Complete QA button should be enabled when there is robots whose shouldRecycle is false and shouldExtinguish is false', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.READY_FOR_QA,
        shouldRecycle: false,
        shouldExtinguish: false
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-complete-qa').prop('disabled')).toEqual(false)
})

it('Complete QA button should be enabled when there is no robots whose shouldRecycle is false and shouldExtinguish is false', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.READY_FOR_QA,
        shouldRecycle: true,
        shouldExtinguish: false
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-complete-qa').prop('disabled')).toEqual(true)
})

it('Complete QA button should be disabled when there is no robots whose qaStatus is READY_FOR_QA', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    robots: [
      {
        id: 1,
        qaStatus: QA_STATUS.PASSED_QA
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  expect(wrapper.find('.btn-complete-qa').prop('disabled')).toEqual(true)
})

it('completeQA action creator should be called when Complete QA button clicked', () => {
  const props = {
    getRobotsForQA: jest.fn(),
    completeQA: jest.fn(),
    robots: [
      {
        id: 1,
        shouldRecycle: true
      }
    ]
  }
  const wrapper = shallow(<Index {...props} />)
  wrapper.find('.btn-complete-qa').simulate('click')
  expect(props.completeQA.mock.calls.length).toEqual(1)
})
