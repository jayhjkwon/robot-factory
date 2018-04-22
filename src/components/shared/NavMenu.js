import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux'
import { QA_STATUS } from '../../constants'
import styled from 'styled-components'
import './NavMenu.css'

const StyledCount = styled.span`
  color: orange;
  font-weight: 300;
  display: ${props => (props.show ? 'inline' : 'none')};
`

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
    const readyForQaCount = this.props.qaState.robots.filter(
      robot => robot.qaStatus === QA_STATUS.READY_FOR_QA
    ).length
    const factorySecondCount = this.props.qaState.robots.filter(
      robot => robot.qaStatus === QA_STATUS.FACTORY_SECOND
    ).length
    const passedQaCount = this.props.qaState.robots.filter(
      robot => robot.qaStatus === QA_STATUS.PASSED_QA
    ).length
    const readyToShipCount = this.props.qaState.robots.filter(
      robot => robot.qaStatus === QA_STATUS.READY_TO_SHIP
    ).length
    const sentCount = this.props.shipmentsState.robots.filter(
      robot => robot.qaStatus === QA_STATUS.SENT_SHIPMENT
    ).length

    return (
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>
              <i className="fab fa-android" /> Robot Factory
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={'/'} exact>
              <NavItem>
                <i className="fas fa-wrench" /> Ready for QA
                <StyledCount show={readyForQaCount > 0}>
                  {' '}
                  ({readyForQaCount})
                </StyledCount>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/factory-second'}>
              <NavItem>
                <i className="fas fa-industry" /> Factory second
                <StyledCount show={factorySecondCount > 0}>
                  {' '}
                  ({factorySecondCount})
                </StyledCount>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/passed-qa'}>
              <NavItem>
                <i className="fas fa-thumbs-up" /> Passed QA
                <StyledCount show={passedQaCount > 0}>
                  {' '}
                  ({passedQaCount})
                </StyledCount>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/ready-to-ship'}>
              <NavItem>
                <i className="fas fa-shipping-fast" /> Ready to ship
                <StyledCount show={readyToShipCount > 0}>
                  {' '}
                  ({readyToShipCount})
                </StyledCount>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/sent-shipment'}>
              <NavItem>
                <i className="fas fa-truck" /> Shipped robots
                <StyledCount show={sentCount > 0}> ({sentCount})</StyledCount>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default connect(
  state => {
    return {
      qaState: state.qualityAssurance,
      shipmentsState: state.shipments
    }
  },
  null,
  null,
  { pure: false }
)(NavMenu)
