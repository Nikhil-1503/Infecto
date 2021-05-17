import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

//chartjs options
const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };
  


function Graph({casesType = 'cases'}) {
    const [data, setData] = useState({});
    //https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=60

    const getChartData = (data, casesType='cases') => {
        const chart = [];
        let lastDataPoint;
        for(var date in data.cases) {
            if(lastDataPoint){
                const createData = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }   
                chart.push(createData);   
            }
            lastDataPoint = data[casesType][date];  
        }
        return chart;
    }

    useEffect(() => {
        const fetchData = async () => {
            fetch('https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=120')
            .then((response) => response.json())
            .then((data) => {
                const chartData = getChartData(data);
                setData(chartData);
            })
        }
        
        fetchData();
    }, [])

    return (
        <div className='graph'>
            {data?.length > 0 && (
            <Line
            data={{
                datasets: [
                {
                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    data: data,
                },
                ],
            }}
            options={options}
            />
             )}
        </div>
    )
}

export default Graph
