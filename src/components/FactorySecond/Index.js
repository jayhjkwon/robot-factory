import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/QualityAssurance'
import RobotList from '../shared/RobotList'
import { QA_STATUS } from '../../constants'

export class Index extends Component {
  render() {
    return (
      <div>
        <h1>Factory second</h1>
        <hr />
        <RobotList {...this.props} statusToFilter={QA_STATUS.FACTORY_SECOND} />
      </div>
    )
  }
}

export default connect(
  state => state.qualityAssurance,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Index)
