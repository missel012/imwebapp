import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import ExpandableForm from './ExpandableForm';
import PatientListPopup from './PatientListPopup';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const Patient = () => {
  const [clinics, setClinics] = useState([]);
  const [localDoctors, setLocalDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    telephone_number: '',
    sex: '',
    date_of_birth: '',
    marital_status: '',
    date_registered: '',
    doctor_id: '',
    kin_full_name: '',
    kin_relationship: '',
    kin_address: '',
    kin_telephone: '',
    examination_room: '',
    exam_result: '',
    appointment_type: '',
    date_of_appointment: '',
    time_of_appointment: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  useEffect(() => {
    fetchClinics();
    fetchLocalDoctors();
    fetchPatients();
  }, []);

  const fetchClinics = async () => {
    const { data, error } = await supabase.from('uk_clinics').select('*');
    if (error) console.error('Error fetching clinics:', error);
    else setClinics(data);
  };

  const fetchLocalDoctors = async () => {
    const { data, error } = await supabase.from('localdoctor').select('*');
    if (error) console.error('Error fetching local doctors:', error);
    else setLocalDoctors(data);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase.from('patient').select('*');
    if (error) console.error('Error fetching patients:', error);
    else setPatients(data);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from('patient').insert([
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        telephone_number: formData.telephone_number,
        sex: formData.sex,
        date_of_birth: formData.date_of_birth,
        marital_status: formData.marital_status,
        date_registered: formData.date_registered,
        doctor_id: formData.doctor_id,
      },
    ]);
    if (error) console.error('Error inserting patient:', error);
    else {
      console.log('Patient added successfully');
      // Clear form after submission
      setFormData({
        first_name: '',
        last_name: '',
        address: '',
        telephone_number: '',
        sex: '',
        date_of_birth: '',
        marital_status: '',
        date_registered: '',
        doctor_id: '',
        kin_full_name: '',
        kin_relationship: '',
        kin_address: '',
        kin_telephone: '',
        examination_room: '',
        exam_result: '',
        appointment_type: '',
        date_of_appointment: '',
        time_of_appointment: '',
      });
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleOpenAddDoctor = () => {
    setIsAddDoctorOpen(true);
  };

  const handleCloseAddDoctor = () => {
    setIsAddDoctorOpen(false);
  };

  const handleAddDoctor = async () => {
    const { error } = await supabase.from('localdoctor').insert([
      {
        doctor_name: formData.doctor_name,
        address: formData.doctor_address,
        telephone: formData.doctor_telephone,
        clinic_number: formData.clinic_number,
      },
    ]);
    if (error) console.error('Error adding doctor:', error);
    else {
      console.log('Doctor added successfully');
      setIsAddDoctorOpen(false);
    }
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <ExpandableForm title="Patient Information">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="first_name" label="First Name" variant="outlined" fullWidth required size='small' value={formData.first_name} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="last_name" label="Last Name" variant="outlined" fullWidth required size='small' value={formData.last_name} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="address" label="Address" variant="outlined" fullWidth required size='small' value={formData.address} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="telephone_number" label="Telephone Number" variant="outlined" fullWidth size='small' value={formData.telephone_number} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="sex"
                label="Sex"
                variant="outlined"
                fullWidth
                select
                required
                size='small'
                value={formData.sex}
                onChange={handleInputChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                size='small'
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="marital_status" label="Marital Status" variant="outlined" fullWidth size='small' value={formData.marital_status} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date_registered"
                label="Date Registered"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                size='small'
                value={formData.date_registered}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size='small'>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctor_id"
                  label="Doctor"
                  required
                  value={formData.doctor_id}
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
            <Button onClick={handleSubmit} variant="contained" color="primary" size='small'>
              Add Patient
            </Button>
          </Box>
        </ExpandableForm>

        {/* Add Next of Kin */}
        <ExpandableForm title="Next of Kin Information">
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="kin_full_name"
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.kin_full_name}
               
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="kin_relationship"
                label="Relationship"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.kin_relationship}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="kin_address"
                label="Address"
                variant="outlined"
                fullWidth
                required
                size='small'
                value={formData.kin_address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="kin_telephone"
                label="Telephone"
                variant="outlined"
                fullWidth
                size='small'
                value={formData.kin_telephone}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Button variant="contained" color="primary" size='small'>
              Add Next of Kin
            </Button>
          </Box>
        </ExpandableForm>

        {/* Add Patient Appointment */}
        <ExpandableForm title="Patient Appointment">
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="examination_room"
                label="Examination Room"
                variant="outlined"
                fullWidth
                size='small'
                value={formData.examination_room}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="exam_result"
                label="Exam Result"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                size='small'
                value={formData.exam_result}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                <MenuItem value="In-Patient">In-Patient</MenuItem>
                <MenuItem value="Out-Patient">Out-Patient</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date_of_appointment"
                label="Date of Appointment"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                size='small'
                value={formData.date_of_appointment}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="time_of_appointment"
                label="Time of Appointment"
                type="time"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                size='small'
                value={formData.time_of_appointment}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Button variant="contained" color="primary" size='small'>
              Add Appointment
            </Button>
          </Box>
        </ExpandableForm>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="text" color="primary" onClick={handleOpenAddDoctor} size='small' sx={{ textDecoration: 'underline' }}>
              Add local doctor here--
            </Button>
          </Box>

        {/* Patient List Popup */}
        <Button onClick={handleOpenPopup} variant="contained" color="primary" size='small' sx={{ mt: 2 }}>
          View Patient List
        </Button>
        <PatientListPopup open={isPopupOpen} onClose={handleClosePopup} patients={patients} />

        {/* Add Doctor Dialog */}
        <Dialog open={isAddDoctorOpen} onClose={handleCloseAddDoctor}>
          <DialogTitle>Add Doctor</DialogTitle>
          <DialogContent>
          <FormControl fullWidth variant="outlined" size='small' sx={{ mt: 2 }}>
              <InputLabel>Clinic</InputLabel>
              <Select
                name="clinic_number"
                label="Clinic"
                required
                value={formData.clinic_number}
                onChange={handleInputChange}
              >
                {clinics.map((clinic) => (
                  <MenuItem key={clinic.clinic_number} value={clinic.clinic_number}>
                    {clinic.clinic_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="doctor_name"
              label="Doctor Name"
              variant="outlined"
              fullWidth
              required
              size='small'
              value={formData.doctor_name}
              onChange={handleInputChange}
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDoctor} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddDoctor} color="primary">
              Add Doctor
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Patient;
