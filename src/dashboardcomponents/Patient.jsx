import React, { useState } from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ExpandableForm from './ExpandableForm'; // Import the ExpandableForm component
import PatientListPopup from './PatientListPopup'; // Import the PatientListPopup component

const Patient = () => {
  // Sample patients array (can be fetched or managed elsewhere in a real application)
  const patients = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    // Add more patients as needed
  ];

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    gender: '',
    phone: '',
    postal_code: '',
    date_of_birth: '',
    marital_status: '',
    kin_name: '', // For next of kin details
    kin_relationship: '',
    kin_address: '',
    kin_phone: '',
    appointment_number: '',
    patient_id: '', // For selecting existing patient
    examination_room: '',
    exam_result: '',
    appointment_type: '', // In-Patient or Out-Patient
    date_of_appointment: '',
    time_of_appointment: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data:', formData);
    // Clear form fields after submission if needed
    setFormData({
      first_name: '',
      last_name: '',
      address: '',
      gender: '',
      phone: '',
      postal_code: '',
      date_of_birth: '',
      marital_status: '',
      kin_name: '',
      kin_relationship: '',
      kin_address: '',
      kin_phone: '',
      appointment_number: '',
      patient_id: '',
      examination_room: '',
      exam_result: '',
      appointment_type: '',
      date_of_appointment: '',
      time_of_appointment: '',
    });
  };

  const [isPopupOpen, setPopupOpen] = useState(false);

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
            <h2 style={{ marginLeft: '10px' }}>Patient</h2>
          </div>
        </div>
      </Paper>
      <div>
        <Box>
          <ExpandableForm title="Patient Information">
            <Grid container spacing={1}>
              <Grid item xs={4} sm={2}>
                <TextField name="first_name" label="First Name" variant="outlined" fullWidth required size='small' value={formData.first_name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField name="last_name" label="Last Name" variant="outlined" fullWidth required size='small' value={formData.last_name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField name="address" label="Street" variant="outlined" fullWidth required size='small' value={formData.address} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  name="gender"
                  label="Gender"
                  variant="outlined"
                  fullWidth
                  select
                  required
                  size='small'
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField name="phone" label="Phone" type="tel" variant="outlined" fullWidth required size='small' value={formData.phone} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField name="postal_code" label="Postal Code" variant="outlined" fullWidth required size='small' value={formData.postal_code} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  size='small'
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="marital_status"
                    label="Marital Status"
                    required
                    value={formData.marital_status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                    <MenuItem value="divorced">Divorced</MenuItem>
                    <MenuItem value="civil_union">Civil Union</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <ExpandableForm title="Next of Kin Details">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                {/* For selecting existing patient */}
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    name="patient_id"
                    label="Select Patient"
                    required
                    value={formData.patient_id}
                    onChange={handleInputChange}
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="kin_name" label="Full Name" variant="outlined" fullWidth required size='small' value={formData.kin_name} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="kin_relationship" label="Relationship" variant="outlined" fullWidth required size='small' value={formData.kin_relationship} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="kin_address" label="Address" variant="outlined" fullWidth required size='small' value={formData.kin_address} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="kin_phone" label="Phone" type="tel" variant="outlined" fullWidth required size='small' value={formData.kin_phone} onChange={handleInputChange} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <ExpandableForm title="Appointment">
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField
                  name="appointment_number"
                  label="Appointment Number"
                  variant="outlined"
                  fullWidth
                  required
                  size='small'
                  value={formData.appointment_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth variant="outlined" size='small'>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    name="patient_id"
                    label="Select Patient"
                    required
                    value={formData.patient_id}
                    onChange={handleInputChange}
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  name="examination_room"
                  label="Examination Room"
                  variant="outlined"
                  fullWidth
                  required
                  size='small'
                  value={formData.examination_room}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  name="exam_result"
                  label="Exam Result"
                  variant="outlined"
                  fullWidth
                  required
                  size='small'
                  value={formData.exam_result}
                  onChange={handleInputChange}
               
                  />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth variant="outlined" size='small'>
                      <InputLabel>Appointment Type</InputLabel>
                      <Select
                        name="appointment_type"
                        label="Appointment Type"
                        required
                        value={formData.appointment_type}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="In-Patient">In-Patient</MenuItem>
                        <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      name="date_of_appointment"
                      label="Date of Appointment"
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      size='small'
                      value={formData.date_of_appointment}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      name="time_of_appointment"
                      label="Time of Appointment"
                      type="time"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      size='small'
                      value={formData.time_of_appointment}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }} onClick={handleSubmit}>
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
    