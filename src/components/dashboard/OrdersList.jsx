import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project import
import Dot from 'components/@extended/Dot';
import { useQuery } from '@tanstack/react-query';
import { getVisit } from 'services/Sitevisit/getVisit';
import { Avatar } from '@mui/material';

// Table headers
const headCells = [
  {
    id: '#',
    align: 'left',
    label: '#'
  },
  {
    id: 'visit_name',
    align: 'left',
    label: 'Visit Name'
  },
  {
    id: 'customer',
    align: 'left',
    label: 'Customer'
  },
  {
    id: 'status',
    align: 'left',
    label: 'Status'
  }
];

// Table Header Component
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Status Component
function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 1:
      color = 'warning';
      title = 'Pending';
      break;
    case 2:
      color = 'success';
      title = 'Processing';
      break;
    case 3:
      color = 'primary';
      title = 'Completed';
      break;
    case 4:
      color = 'secondary';
      title = 'Not Completed';
      break;
    case 5:
      color = 'secondary';
      title = 'Not Started';
      break;
    default:
      color = 'primary';
      title = 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// Main Component
export default function OrdersList() {
  const { data: siteVisits = [] } = useQuery({
    queryFn: () => getVisit({
      limit: 10
    }),
    queryKey: ['siteVisits'],
    onError: (error) => {
      console.error('Error fetching site visit:', error);
    }
  });

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table>
          <OrderTableHead />
          <TableBody>
            {siteVisits.length > 0 ? (
              siteVisits.map((visit, index) => (
                <TableRow hover key={visit.visitid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" color="initial">
                        {visit.visitname || '-'}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        {visit.companyname || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                      }}
                    >
                      <Avatar src={visit?.customerDetails?.customerimage} />
                      <Box>
                        <Typography variant="body1" color="initial">
                          {visit?.customerDetails?.customername || '-'}
                        </Typography>
                        <Typography variant="body1" color="secondary">
                          {visit?.customerDetails?.companyname || '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <OrderStatus status={visit.visitstatus} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Site Visits Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
