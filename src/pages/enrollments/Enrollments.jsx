import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEnrollments } from 'services/enrollments/getEnrollments';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router';
const statusColors = {
  'Cooling Period': 'info',
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error'
};

const Enrollments = () => {
  const studentidfromlocal = localStorage.getItem('studentid');

  const { data } = useQuery({
    queryFn: () =>
      getEnrollments({
        studentid: Number(studentidfromlocal)
      }),
    queryKey: ['enrollments']
  });

  const enrollmentData = data?.response;

  const navigate = useNavigate();

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {enrollmentData?.map((enrollment) => (
        <Grid item xs={12} sm={6} md={4} key={enrollment.enrollmentid}>
          <Card variant="outlined">
            <CardHeader
              avatar={<Avatar src={enrollment.admin?.adminimage} alt={enrollment.admin?.adminname} />}
              title={enrollment.universityname}
              subheader={`${enrollment.coursename} - ${enrollment.departmentname}`}
              action={
                <Chip label={enrollment.enrollmentstatus} color={statusColors[enrollment.enrollmentstatus] || 'default'} size="small" />
              }
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                <strong>Student:</strong> {enrollment.student.studentfirstname} {enrollment.student.studentlastname}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Email:</strong> {enrollment.student.studentemail}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Admin:</strong> {enrollment.admin?.adminname || 'N/A'}
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                fullWidth
                onClick={() => navigate(`/student-enrollments/${enrollment.enrollmentid}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Enrollments;
