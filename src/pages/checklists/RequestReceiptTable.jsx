import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button } from '@mui/material';
import PaymentReceipetUploadBtn from './Btns/PaymentReceipetUploadBtn';

const RequestReceiptTable = ({ checklistData, checklistName }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Checklist Name</TableCell>
            <TableCell>View</TableCell>
            <TableCell>Upload</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checklistData.map((checklist, index) => (
            <TableRow key={index}>
              <TableCell>{checklistName}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => window.open(checklist.documenturl, '_blank')}>
                  View
                </Button>
              </TableCell>
              <TableCell>
                <PaymentReceipetUploadBtn checklist={checklist} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestReceiptTable;
