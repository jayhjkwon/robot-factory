import React from 'react'
import RobotItem from './RobotItem'
import _ from 'lodash'
import { QA_STATUS } from '../../constants'
import { Table } from 'react-bootstrap'
import styled from 'styled-components'

export const StyledLoading = styled.h4`
  text-align: center;
`

const RobotList = props => {
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Sentience</th>
          <th>Wheels</th>
          <th>Tracks</th>
          <th>#Rotors</th>
          <th>Colour</th>
          <th>Statuses</th>
          {props.statusToFilter === QA_STATUS.READY_FOR_QA && (
            <th className="header-extinguish">Extinguish</th>
          )}
          {props.statusToFilter === QA_STATUS.READY_FOR_QA && (
            <th className="header-recycle">Recycle</th>
          )}
          {(props.statusToFilter === QA_STATUS.FACTORY_SECOND ||
            props.statusToFilter === QA_STATUS.PASSED_QA) && (
            <th className="header-add-to-shipment">Add to Shipment</th>
          )}
          {props.statusToFilter === QA_STATUS.READY_TO_SHIP && (
            <th className="header-remove-from-shipment">
              Remove from shipment
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {_.chain(props.robots)
          .filter(robot => robot.qaStatus === props.statusToFilter)
          .map(robot => {
            return <RobotItem key={robot.id} {...robot} {...props} />
          })
          .value()}

        {props.isLoading ? (
          <tr>
            <td colSpan={10}>
              <StyledLoading>Loading...</StyledLoading>
            </td>
          </tr>
        ) : null}
      </tbody>
    </Table>
  )
}

export default RobotList
