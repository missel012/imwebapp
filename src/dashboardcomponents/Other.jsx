import React from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Other = () => {
  // Sample data for the table
  const localDoctorInfo = [
    { clinicNumber: '001', fullName: 'John Doe', address: '123 Main Street', telephoneNumber: '555-1234' },
    { clinicNumber: '002', fullName: 'Jane Smith', address: '456 Elm Street', telephoneNumber: '555-5678' },
    { clinicNumber: '003', fullName: 'Michael Johnson', address: '789 Oak Street', telephoneNumber: '555-9101' },
  ];

  return (
    <div>
      <Paper elevation={3}>
        <div className="icon" style={{ display: 'flex' }}>
          <div style={{ margin: '8px' }}>
            <img src="../../img/other.png" alt="Other section icon" />
          </div>
          <div>
            <h2 style={{ marginLeft: '10px' }}>Other</h2>
          </div>
        </div>
      </Paper>
      <Box>
        <ExpandableForm title="Local Doctor Information">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Clinic Number</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Telephone Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {localDoctorInfo.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell>{doctor.clinicNumber}</TableCell>
                        <TableCell>{doctor.fullName}</TableCell>
                        <TableCell>{doctor.address}</TableCell>
                        <TableCell>{doctor.telephoneNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </ExpandableForm>
        <ExpandableForm title="FAQs">
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <ExpandableForm title="Where is your Hospital Location?">
                <code>Our hospital is located at 123 Wellness Blvd, Health City.</code>
              </ExpandableForm>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ExpandableForm title="Office Time?">
                <code>We are open 24/7 to serve you.</code>
              </ExpandableForm>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ExpandableForm title="Hiring?">
                <code>Currently, we are not hiring. Please check back later for opportunities.</code>
              </ExpandableForm>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ExpandableForm title="Do you consider PhilHealth beneficiaries?">
                <code>Yes, we accept PhilHealth beneficiaries. Please bring your PhilHealth ID and other necessary documents during your visit.</code>
              </ExpandableForm>
            </Grid>
          </Grid>
        </ExpandableForm>
      </Box>
    </div>
  );
};

export default Other;