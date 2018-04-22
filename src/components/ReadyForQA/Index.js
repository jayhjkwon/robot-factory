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
  componentDidMount() {
    this.props.getRobotsForQA()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recycleSuccess) {
      toast.success('Well done!')
      this.props.resetRecycleSuccess()
    }
    if (nextProps.completeQaSuccess) {
      toast.success('Well done')
      this.props.resetCompleteQaSuccess()
      this.props.history.push('/factory-second')
    }
  }

  handleRecycleButton = e => {
    let ids = _.chain(this.props.robots)
      .filter(robot => robot.shouldRecycle)
      .map(robot => robot.id)
      .value()

    this.props.recycleRobots(ids)
  }

  handleCompleteQaButton = e => {
    this.props.completeQA()
  }

  enableRecycleRobotsButton = () => {
    return _.some(this.props.robots, 'shouldRecycle')
  }

  enableComplteQaButton = () => {
    const robotsForReqdyForQa = _.filter(
      this.props.robots,
      robot => robot.qaStatus === QA_STATUS.READY_FOR_QA
    )
    if (robotsForReqdyForQa.length <= 0) return false

    const recycle = _.some(this.props.robots, 'shouldRecycle')
    const extinguish = _.some(this.props.robots, 'shouldExtinguish')
    return !recycle && !extinguish
  }

  render() {
    return (
      <div>
        <h1>Ready For QA</h1>
        <hr />
        <Row>
          <Col sm={3} smOffset={6}>
            <Button
              onClick={this.handleRecycleButton}
              bsStyle="warning"
              bsSize="large"
              block
              disabled={!this.enableRecycleRobotsButton()}
              className="btn-recycle-robots"
            >
              Recycle robots
            </Button>
          </Col>
          <Col sm={3}>
            <Button
              onClick={this.handleCompleteQaButton}
              bsStyle="primary"
              bsSize="large"
              block
              disabled={!this.enableComplteQaButton()}
              className="btn-complete-qa"
            >
              Complete QA
            </Button>
          </Col>
        </Row>
        <hr />
        <RobotList {...this.props} statusToFilter={QA_STATUS.READY_FOR_QA} />
      </div>
    )
  }
}

export default connect(
  state => state.qualityAssurance,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Index)
