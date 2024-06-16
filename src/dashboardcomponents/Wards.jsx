import React from 'react';
import { Box, Paper, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Wards = () => {
  return (
    <div>
      <Paper elevation={6}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/ward.png" alt="Staff" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>AddWard</h2>
        </div>
      </div>
      </Paper>
        <Box>
          <div>
          <ExpandableForm title="Ward name">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField label="Ward Name" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Location" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Number of Beds" type="number" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" type="tel" variant="outlined" fullWidth required size='small'/>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1, textAlign: 'center'}}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{background:'#0012bff'}}>
                Submit
              </Button>
            </Box>

          </ExpandableForm>
          </div>
          <div>
            <ExpandableForm title="Waiting List">
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Schedule</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Empty table body */}
                  </TableBody>
                </Table>
              </TableContainer>
            </ExpandableForm>
          </div>
        </Box>
      {/* Patient content goes here */}
    </div>
  );
};

export default Wards;