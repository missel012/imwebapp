import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandableForm from './ExpandableForm'; // Import the ExpandableForm component
import PatientListPopup from './PatientListPopup'; // Import the PatientListPopup component
import { supabase } from '../supabaseClient';

const Patient = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let { data: patientsData, error } = await supabase
          .from('patient')
          .select('*');
        if (error) {
          throw error;
        }

        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error.message);
      }
    };

    fetchPatients();
  }, []);

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
    patient_id: '', // For selecting existing patient
    examination_room: '',
    exam_result: '',
    appointment_type: '', // In-Patient or Out-Patient
    date_of_appointment: '',
    time_of_appointment: '',
    referral_doctor: '', // New field for local doctor referral
    clinic_number: '', // For adding local doctors
    doctor_name: '',
    doctor_address: '',
    doctor_telephone: ''
  });

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isAddDoctorOpen, setAddDoctorOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [localDoctors, setLocalDoctors] = useState([]);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      let { data: clinicsData, error } = await supabase
        .from('uk_clinics')
        .select('clinic_number, clinic_name');
      if (error) {
        throw error;
      }

      setClinics(clinicsData);
    } catch (error) {
      console.error('Error fetching clinics:', error.message);
    }
  };

  useEffect(() => {
    const fetchLocalDoctors = async () => {
      try {
        let { data: localDoctorsData, error } = await supabase
          .from('localdoctor')
          .select('*');
        if (error) {
          throw error;
        }

        setLocalDoctors(localDoctorsData);
      } catch (error) {
        console.error('Error fetching local doctors:', error.message);
      }
    };
    fetchLocalDoctors();
  }, []); // Empty dependency array to run effect only once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data:', formData);
    // Clear form fields after submission if needed
    clearFormFields();
  };

  const clearFormFields = () => {
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
      patient_id: '',
      examination_room: '',
      exam_result: '',
      appointment_type: '',
      date_of_appointment: '',
      time_of_appointment: '',
      referral_doctor: '',
      clinic_number: '',
      doctor_name: '',
      doctor_address: '',
      doctor_telephone: ''
    });
  };

  const handleAddDoctor = async () => {
    try {
      const { data, error } = await supabase
        .from('localdoctor')
        .insert([
          {
            doctor_name: formData.doctor_name,
            address: formData.doctor_address,
            telephone: formData.doctor_telephone,
            clinic_number: formData.clinic_number,
          },
        ]);
      if (error) {
        throw error;
      }

      console.log('Doctor added successfully:', data);

      // Close the dialog after successful addition
      handleCloseAddDoctor();
      // Clear form fields
      clearFormFields();
      // Optionally, update local doctors list
      fetchLocalDoctors();
    } catch (error) {
      console.error('Error adding doctor:', error.message);
      // Handle error state if necessary
    }
  };

  const fetchLocalDoctors = async () => {
    try {
      let { data: localDoctorsData, error } = await supabase
        .from('localdoctor')
        .select();
      if (error) {
        throw error;
      }

      setLocalDoctors(localDoctorsData);
    } catch (error) {
      console.error('Error fetching local doctors:', error.message);
    }
  };

  const handleOpenAddDoctor = () => {
    setAddDoctorOpen(true);
  };

  const handleCloseAddDoctor = () => {
    setAddDoctorOpen(false);
  };

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
                <TextField name="address" label="Address" variant="outlined" fullWidth required size='small' value={formData.address} onChange={handleInputChange} />
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
                </TextField>
              </Grid>
              <Grid item xs={4} sm={2}>
                <TextField name="telephone" label="Telephone" type="tel" variant="outlined" fullWidth required size='small' value={formData.phone} onChange={handleInputChange} />
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
                <TextField
                  name="date_registered"
                  label="Date Registered"
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
                  <InputLabel>Local Doctor Referral</InputLabel>
                  <Select
                    name="referral_doctor"
                    label="Local Doctor Referral"
                    required
                    value={formData.referral_doctor}
                    onChange={handleInputChange}
                  >
                    {localDoctors.map((doctor) => (
                      <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                        {doctor.doctor_name}
                      </MenuItem>
                    ))}
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
                      <MenuItem key={patient.patient_number} value={patient.patient_number}>
                        {`${patient.first_name} ${patient.last_name}`}
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
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>
          <ExpandableForm title="Appointment Details">
            <Grid container spacing={2}>
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
                      <MenuItem key={patient.patient_number} value={patient.patient_number}>
                        {`${patient.first_name} ${patient.last_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="examination_room" label="Examination Room" variant="outlined" fullWidth required size='small' value={formData.examination_room} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField name="exam_result" label="Exam Result" variant="outlined" fullWidth required size='small' value={formData.exam_result} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  name="appointment_type"
                  label="Appointment Type"
                  variant="outlined"
                  fullWidth
                  select
                  required
                  size='small'
                  value={formData.appointment_type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="in_patient">In-Patient</MenuItem>
                  <MenuItem value="out_patient">Out-Patient</MenuItem>
                </TextField>
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
            <Box sx={{ mt: 1, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{ background: '#007bff' }} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </ExpandableForm>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="text" color="primary" onClick={handleOpenAddDoctor} size='small' sx={{ textDecoration: 'underline' }}>
              Add local doctor here--
            </Button>
          </Box>

          {/* Popup for adding local doctor */}
          <Dialog open={isAddDoctorOpen} onClose={handleCloseAddDoctor}>
            <DialogTitle>Add Local Doctor</DialogTitle>
            <DialogContent>
              <FormControl fullWidth variant="outlined" size='small'>
                <InputLabel>Clinic Number</InputLabel>
                <Select
                  name="clinic_number"
                  label="Clinic Number"
                  required
                  value={formData.clinic_number}
                  onChange={handleInputChange}
                >
                  {clinics.map((clinic) => (
                    <MenuItem key={clinic.clinic_number} value={clinic.clinic_number}>
                      {`${clinic.clinic_number} - ${clinic.clinic_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Other form fields for local doctor */}
              <TextField
                name="doctor_name"
                label="Doctor Name"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.doctor_name}
                onChange={handleInputChange}
                style={{ marginTop: '16px' }}
              />
              <TextField
                name="doctor_address"
                label="Doctor Address"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.doctor_address}
                onChange={handleInputChange}
                style={{ marginTop: '16px' }}
              />
              <TextField
                name="doctor_telephone"
                label="Doctor Telephone"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.doctor_telephone}
                onChange={handleInputChange}
                style={{ marginTop: '16px' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDoctor} color="primary" size='small'>
                Cancel
              </Button>
              <Button onClick={handleAddDoctor} color="primary" size='small'>
                Add Doctor
              </Button>
            </DialogActions>
          </Dialog>

          {/* View Patients List Popup */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenPopup} size='small'>
              View Patients List
            </Button>
          </Box>

          {/* Popup for viewing patient list */}
          <PatientListPopup open={isPopupOpen} onClose={handleClosePopup} patients={patients} />
        </Box>
      </div>
    </div>
  );
};

export default Patient;