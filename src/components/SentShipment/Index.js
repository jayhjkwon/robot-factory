import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/Shipments'
import RobotList from '../shared/RobotList'
import { QA_STATUS } from '../../constants'

export class Index extends Component {
  componentDidMount() {
    this.props.getShipments()
  }

  render() {
    return (
      <div>
        <h1>Shipped robots</h1>
        <hr />
        <RobotList {...this.props} statusToFilter={QA_STATUS.SENT_SHIPMENT} />
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Index)
