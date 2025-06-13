import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// project import
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// third-party
import ReactApexChart from 'react-apexcharts';

// ==============================|| USER CARD CHART ||============================== //

export default function UsersCardChart({ response }) {
  const theme = useTheme();
  const { mode } = useConfig();

  // chart options
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
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '80%'
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter(val) {
          return val;
        }
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  // Update chart options based on theme
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  // Set counts from response or fallback to an empty array
  const counts = response?.seriesData || [];

  // Ensure counts are always passed to series
  const [series, setSeries] = useState([
    {
      name: 'Customers',
      data: counts
    }
  ]);

  useEffect(() => {
    if (counts.length > 0) {
      setSeries([
        {
          name: 'Customers',
          data: counts
        }
      ]);
    }
  }, [counts]);

  console.log('response?.userSeriesData', response?.userSeriesData);
  console.log('counts', counts);

  // Only render the chart if counts is not empty
  return counts.length > 0 ? <ReactApexChart options={options} series={series} type="bar" height={100} /> : null;
}
