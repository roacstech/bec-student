import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// third-party
import ReactApexChart from 'react-apexcharts';

// ==============================|| SALES CARD CHART ||============================== //

export default function SalesCardChart({response}) {
  const theme = useTheme();
  const { mode } = useConfig();

  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      sparkline: {
        enabled: true
      },
      height: 100,
      type: 'bar',
      toolbar: {
        show: false
      },
      offsetX: -4
    },
    plotOptions: {
      bar: {
        borderRadius: 0
      }
    },
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter(val) {
          return `$ ${val}`;
        }
      }
    },
    grid: {
      show: false
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  const counts = response?.seriesData || [];

  // Ensure counts are always passed to series
  const [series, setSeries] = useState([
    {
      name: 'Orders',
      data: counts
    }
  ]);

  useEffect(() => {
    if (counts.length > 0) {
      setSeries([
        {
          name: 'Orders',
          data: counts
        }
      ]);
    }
  }, [counts]);

  console.log('response?.userSeriesData', response?.seriesData);
  console.log('counts', counts);

  return <ReactApexChart options={options} series={series} type="bar" height={100} />;
}
