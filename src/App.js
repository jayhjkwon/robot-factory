import React from 'react'
import { Route } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/shared/Layout'
import ReadyForQA from './components/ReadyForQA/Index'
import FactorySecond from './components/FactorySecond/Index'
import PassedQA from './components/PassedQA/Index'
import ReadyToShip from './components/ReadyToShip/Index'
import SentShipment from './components/SentShipment/Index'

export default () => (
  <div>
    <Layout>
      <Route exact path="/" component={ReadyForQA} />
      <Route path="/factory-second" component={FactorySecond} />
      <Route path="/passed-qa" component={PassedQA} />
      <Route path="/ready-to-ship" component={ReadyToShip} />
      <Route path="/sent-shipment" component={SentShipment} />
    </Layout>

    <ToastContainer autoClose={2000} />
  </div>
)
