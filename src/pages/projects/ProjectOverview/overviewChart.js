import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, CardTitle } from "reactstrap"
import ReactApexChart from "react-apexcharts"

const OverviewChart = ({ options, series }) => {
  if (!series || series.length === 0) {
    return (
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Overview</CardTitle>
          <div>No data available</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Overview</CardTitle>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="290"
          className="apex-charts"
        />
      </CardBody>
    </Card>
  )
}

OverviewChart.propTypes = {
  options: PropTypes.object.isRequired,
  series: PropTypes.array.isRequired,
}

export default OverviewChart
