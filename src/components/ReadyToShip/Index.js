import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/QualityAssurance'
import RobotList from '../shared/RobotList'
import { Col, Row, Button } from 'react-bootstrap'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { QA_STATUS } from '../../constants'

export class Index extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.sendShipmentSuccess) {
      toast.success('Well done!')
      this.props.resetSendShipmentSuccess()
      this.props.history.push('/sent-shipment')
    }
  }

  handleSendShipment = e => {
    this.props.sendShipment()
  }

  enableSendShipmentButton = () => {
    const robotsForReqdyToShip = _.filter(
      this.props.robots,
      robot => robot.qaStatus === QA_STATUS.READY_TO_SHIP
    )
    return robotsForReqdyToShip.length > 0
  }

  render() {
    return (
      <div>
        <h1>Ready to ship</h1>
        <hr />
        <Row>
          <Col sm={3} smOffset={9}>
            <Button
              onClick={this.handleSendShipment}
              bsStyle="primary"
              bsSize="large"
              block
              disabled={!this.enableSendShipmentButton()}
              className="btn-send-shipment"
            >
              Send shipment
            </Button>
          </Col>
        </Row>
        <hr />
        <RobotList {...this.props} statusToFilter={QA_STATUS.READY_TO_SHIP} />
      </div>
    )
  }
}

export default connect(
  state => state.qualityAssurance,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Index)
