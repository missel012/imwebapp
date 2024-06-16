import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import React, { useState } from 'react';
import '../dashboardstyle.css';
import ExpandableForm from './ExpandableForm'; // Import the ExpandableForm component
import PatientListPopup from './PatientListPopup'; // Import the PatientListPopup component

const Patient = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const patients = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    // Add more patients as needed
  ];

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <Paper elevation={2}>
        <div className="icon" style={{ display: 'flex' }}>
          <div style={{ margin: '8px' }}>
            <img src="../../img/patient.png" alt="Patient" />
          </div>
          <div>
            <h2 style={{ marginLeft: '10px' }}> Patient</h2>
          </div>
        </div>
      </Paper>
      <div>
        <Box>
          <ExpandableForm title="Add Patient Information">
            <Grid container spacing={1}>
              <Grid item xs={4} sm={2}>
                <TextField label="First Name" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Last Name" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Street" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Gender" variant="outlined" fullWidth select required size='small'>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="City" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Phone" type="tel" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Postal Code" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="NIN" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="State" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField label="Date of Birth" type="date" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} required size='small' />
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
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <ExpandableForm title="Next of Kin Details">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField label="Full Name" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Relationship" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Address" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Phone" type="tel" variant="outlined" fullWidth required size='small' />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <ExpandableForm title="Local Doctor Referrals">
            <FormControl fullWidth variant="outlined" required size='small'>
              <InputLabel id="local-doctor-select-label">Select Local Doctor</InputLabel>
              <Select
                labelId="local-doctor-select-label"
                id="local-doctor-select"
                label="Select Local Doctor"
              >
                <MenuItem value="doctor1">Doctor 1</MenuItem>
                <MenuItem value="doctor2">Doctor 2</MenuItem>
                <MenuItem value="doctor3">Doctor 3</MenuItem>
                <MenuItem value="doctor4">Doctor 4</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <ExpandableForm title="Appointment">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField label="Appointment Number" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Patient Number" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField label="Staff Number" variant="outlined" fullWidth required size='small' />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select label="Appointment Type" required>
                    <MenuItem value="In-Patient">In-Patient</MenuItem>
                    <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenPopup}>
              View Patients List
            </Button>
          </Box>

          <PatientListPopup open={isPopupOpen} onClose={handleClosePopup} patients={patients} />
        </Box>
      </div>
    </div>
  );
};

export default Patient;
