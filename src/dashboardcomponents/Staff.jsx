import React from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Staff = () => {
  return (
    <div>
      <Paper elevation={3}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/staff.png" alt="Staff" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>AddStaff</h2>
        </div>
      </div>
      </Paper>
        <Box>
          <div>
          <ExpandableForm title="Staff Information">
            <Grid container spacing={1}>
              <Grid item xs={4} sm={2}>
                <TextField label="First Name" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Last Name" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Street" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Gender" variant="outlined" fullWidth select required size='small'>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="City" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Phone" type="tel" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Postal Code" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="NIN" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="State" variant="outlined" fullWidth required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Date of Birth" type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} required size='small'/>
              </Grid>
              <Grid item xs={4} sm={2}>
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel>Marital Status</InputLabel>
                  <Select label="Marital Status" required>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                    <MenuItem value="divorced">Divorced</MenuItem>
                    <MenuItem value="civil_union">Civil Union</MenuItem>
                  </Select>
                </FormControl>
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
            <ExpandableForm title="Work Experience">
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

export default Staff;
