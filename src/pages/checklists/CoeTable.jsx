import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button } from '@mui/material';
import PaymentReceipetUploadBtn from './Btns/PaymentReceipetUploadBtn';
import CoeUploadBtn from './Btns/CoeUploadBtn';

const CoeTable = ({ checklistData, findChecklistName }) => {
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
              <TableCell>{findChecklistName(checklist.checklistid)}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => window.open(checklist.documenturl, '_blank')}>
                  View
                </Button>
              </TableCell>
              <TableCell>
                <CoeUploadBtn checklist={checklist} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoeTable;
