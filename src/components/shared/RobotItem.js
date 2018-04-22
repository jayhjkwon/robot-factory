import React from 'react'
import { Button } from 'react-bootstrap'
import YesIcon from '../shared/YesIcon'
import { QA_STATUS } from '../../constants'

const RobotItem = props => {
  const handleExtinguishButton = e => {
    props.extinguishRobot(props.id)
  }

  const handleAddToShipmentButton = e => {
    props.addToShipment(props.id)
  }

  const handleRemoveFromShipmentButton = e => {
    props.removeFromShipment(props.id)
  }

  return (
    <tr key={props.id}>
      <td className="robot-id">{props.id}</td>
      <td className="robot-name">{props.name}</td>
      <td className="has-sentience">
        {props.configuration && props.configuration.hasSentience ? (
          <YesIcon />
        ) : (
          ''
        )}
      </td>
      <td className="has-wheels">
        {props.configuration && props.configuration.hasWheels ? (
          <YesIcon />
        ) : (
          ''
        )}
      </td>
      <td className="has-tracks">
        {props.configuration && props.configuration.hasTracks ? (
          <YesIcon />
        ) : (
          ''
        )}
      </td>
      <td className="rotors">
        {props.configuration ? props.configuration.numberOfRotors : ''}
      </td>
      <td className="color">
        {props.configuration ? props.configuration.colour : ''}
      </td>
      <td className="statuses">
        {props.statuses ? props.statuses.join(', ') : ''}
      </td>
      {props.statusToFilter === QA_STATUS.READY_FOR_QA && (
        <td className="should-extinguish">
          {props.shouldExtinguish ? (
            <Button
              bsStyle="danger"
              bsSize="small"
              onClick={handleExtinguishButton}
              className="btn-should-extinguish"
            >
              <i className="fas fa-fire-extinguisher" /> Extinguish
            </Button>
          ) : null}
        </td>
      )}
      {props.statusToFilter === QA_STATUS.READY_FOR_QA && (
        <td className="should-recycle">
          {props.shouldRecycle ? <YesIcon /> : ''}
        </td>
      )}
      {(props.statusToFilter === QA_STATUS.FACTORY_SECOND ||
        props.statusToFilter === QA_STATUS.PASSED_QA) && (
        <td className="add-to-shipment">
          <Button
            bsStyle="primary"
            bsSize="small"
            onClick={handleAddToShipmentButton}
            className="btn-add-to-shipment"
          >
            <i className="fas fa-plus" /> Add
          </Button>
        </td>
      )}
      {props.statusToFilter === QA_STATUS.READY_TO_SHIP && (
        <td className="remove-from-shipment">
          <Button
            bsStyle="warning"
            bsSize="small"
            onClick={handleRemoveFromShipmentButton}
            className="btn-remove-from-shipment"
          >
            <i className="fas fa-trash-alt" /> Remove
          </Button>
        </td>
      )}
    </tr>
  )
}

export default RobotItem
