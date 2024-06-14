import React from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Wards = () => {
  return (
    <div>
      <Paper elevation={3}>
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
              <Grid item xs={6} sm={3}>
                <TextField label="Ward Name" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Location" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Number of Beds" type="number" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Phone" type="tel" variant="outlined" fullWidth required size='small'/>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1, textAlign: 'center'}}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{background:'#007bff'}}>
                Submit
              </Button>
            </Box>

          </ExpandableForm>
          </div>
          <div>
            <ExpandableForm title="Waiting List">
              <Grid container spacing={1}>
                <Grid item xs={4} sm={2}>
                  <TextField label="First Name" variant="outlined" fullWidth required size='small'/>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField label="Last Name" variant="outlined" fullWidth required size='small'/>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField label="Position name" variant="outlined" fullWidth required size='small'/>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField label="Start Date" type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} required size='small'/>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField label="Finish Date" type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} required size='small'/>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <TextField label="Organization" variant="outlined" fullWidth required size='small'/>
                </Grid>
              </Grid>
              <Box sx={{ mt: 1, textAlign: 'center'}}>
                <Button type="submit" variant="contained" color="secondary" size='small' style={{background:'#007bff'}}>
                  Submit
                </Button>
              </Box>
            </ExpandableForm>
          </div>
        </Box>
      {/* Patient content goes here */}
    </div>
  );
};

export default Wards;
