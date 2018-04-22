class QualityAssuranceService {
  baseUrl = 'http://localhost:3001'

  async getRobotsForQA() {
    const response = await fetch(`${this.baseUrl}/robots.json`)
    const json = await response.json()
    return json
  }

  async getShipments() {
    const response = await fetch(`${this.baseUrl}/shipments.json`)
    const json = await response.json()
    return json
  }

  async extinguishRobot(id) {
    const response = await fetch(
      `${this.baseUrl}/robots/${id}/extinguish.json`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }
    )

    return response
  }

  async recycleRobots(ids) {
    const response = await fetch(`${this.baseUrl}/robots/recycle.json`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recycleRobots: ids })
    })
    const json = await response.json()
    return json
  }

  async sendShipment(ids) {
    const response = await fetch(`${this.baseUrl}/shipments/create`, {
      method: 'put',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ robotIds: ids })
    })
    const json = await response.json()
    return json
  }
}

export default new QualityAssuranceService()
