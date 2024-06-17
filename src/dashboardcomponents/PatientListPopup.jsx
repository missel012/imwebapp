import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, List, ListItem, ListItemText, IconButton, Box, Typography, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../supabaseClient'; 

const PatientListPopup = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedPatient, setEditedPatient] = useState({
    patient_number: '',
    first_name: '',
    last_name: '',
    address: '',
    telephone_number: '',
    sex: '',
    date_of_birth: '',
    marital_status: '',
    date_registered: '',
    kin_details: {
      full_name: '',
      relationship: '',
      address: '',
      telephone: ''
    }
  });
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [appointmentTypes, setAppointmentTypes] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: patientsData, error: patientsError } = await supabase.from('patient').select('*');
      const { data: kinData, error: kinError } = await supabase.from('patient_next_of_kin').select('*');
      const { data: appointmentData, error: appointmentError } = await supabase.from('patient_appointment').select('patient_number, appointment_type');

      if (patientsError || kinError || appointmentError) {
        console.error('Error fetching patients, kin details, or appointment types:', patientsError || kinError || appointmentError);
        return;
      }

      const appointmentTypesMap = appointmentData.reduce((acc, appointment) => {
        acc[appointment.patient_number] = appointment.appointment_type;
        return acc;
      }, {});

      const mergedPatients = patientsData.map(patient => {
        const kinDetail = kinData.find(kin => kin.patient_number === patient.patient_number);
        return {
          ...patient,
          kin_details: kinDetail || { full_name: '', relationship: '', address: '', telephone: '' },
          appointment_type: appointmentTypesMap[patient.patient_number] || ''
        };
      });

      setPatients(mergedPatients);
      setFilteredPatients(mergedPatients);
      setAppointmentTypes(appointmentTypesMap);
    } catch (error) {
      console.error('Error fetching patients, kin details, or appointment types:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = patients.filter((patient) => {
      return (
        patient.first_name.toLowerCase().includes(searchTerm) ||
        patient.last_name.toLowerCase().includes(searchTerm) ||
        patient.kin_details.full_name.toLowerCase().includes(searchTerm) ||
        patient.kin_details.relationship.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredPatients(filtered);
  };

  const handleEditPatient = (patient) => {
    setEditedPatient({
      patient_number: patient.patient_number,
      first_name: patient.first_name,
      last_name: patient.last_name,
      address: patient.address,
      telephone_number: patient.telephone_number,
      sex: patient.sex,
      date_of_birth: patient.date_of_birth,
      marital_status: patient.marital_status,
      date_registered: patient.date_registered,
      kin_details: {
        full_name: patient.kin_details.full_name,
        relationship: patient.kin_details.relationship,
        address: patient.kin_details.address,
        telephone: patient.kin_details.telephone
      }
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    clearEditedPatient();
  };

  const clearEditedPatient = () => {
    setEditedPatient({
      patient_number: '',
      first_name: '',
      last_name: '',
      address: '',
      telephone_number: '',
      sex: '',
      date_of_birth: '',
      marital_status: '',
      date_registered: '',
      kin_details: {
        full_name: '',
        relationship: '',
        address: '',
        telephone: ''
      }
    });
  };

  const handleSaveEditedPatient = async () => {
    try {
      const { data: updatedPatientData, error: updatePatientError } = await supabase
        .from('patient')
        .update({
          first_name: editedPatient.first_name,
          last_name: editedPatient.last_name,
          address: editedPatient.address,
          telephone_number: editedPatient.telephone_number,
          sex: editedPatient.sex,
          date_of_birth: editedPatient.date_of_birth,
          marital_status: editedPatient.marital_status,
          date_registered: editedPatient.date_registered
        })
        .eq('patient_number', editedPatient.patient_number);

      if (updatePatientError) {
        throw new Error('Error updating patient details: ' + updatePatientError.message);
      }

      const { data: existingKinData, error: fetchKinError } = await supabase
        .from('patient_next_of_kin')
        .select('*')
        .eq('patient_number', editedPatient.patient_number);

      if (fetchKinError) {
        throw new Error('Error fetching next of kin details: ' + fetchKinError.message);
      }

      const existingKinRecord = existingKinData.find(kin => kin.full_name === editedPatient.kin_details.full_name &&
                                                         kin.relationship === editedPatient.kin_details.relationship &&
                                                         kin.address === editedPatient.kin_details.address &&
                                                         kin.telephone === editedPatient.kin_details.telephone);

      if (existingKinRecord) {
        const { data: updatedKinData, error: updateKinError } = await supabase
          .from('patient_next_of_kin')
          .update({
            full_name: editedPatient.kin_details.full_name,
            relationship: editedPatient.kin_details.relationship,
            address: editedPatient.kin_details.address,
            telephone: editedPatient.kin_details.telephone
          })
          .eq('patient_number', editedPatient.patient_number)
          .eq('full_name', existingKinRecord.full_name)
          .eq('relationship', existingKinRecord.relationship);

        if (updateKinError) {
          throw new Error('Error updating next of kin details: ' + updateKinError.message);
        }
      } else {
        const { data: insertedKinData, error: insertKinError } = await supabase
          .from('patient_next_of_kin')
          .insert({
            patient_number: editedPatient.patient_number,
            full_name: editedPatient.kin_details.full_name,
            relationship: editedPatient.kin_details.relationship,
            address: editedPatient.kin_details.address,
            telephone: editedPatient.kin_details.telephone
          });

        if (insertKinError) {
          throw new Error('Error inserting next of kin details: ' + insertKinError.message);
        }
      }

      const updatedPatients = patients.map((patient) => {
        if (patient.patient_number === editedPatient.patient_number) {
          return {
            ...patient,
            first_name: editedPatient.first_name,
            last_name: editedPatient.last_name,
            address: editedPatient.address,
            telephone_number: editedPatient.telephone_number,
            sex: editedPatient.sex,
            date_of_birth: editedPatient.date_of_birth,
            marital_status: editedPatient.marital_status,
            kin_details: {
              full_name: editedPatient.kin_details.full_name,
              relationship: editedPatient.kin_details.relationship,
              address: editedPatient.kin_details.address,
              telephone: editedPatient.kin_details.telephone
            }
          };
        } else {
          return patient;
        }
      });

      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);

      handleCloseEditDialog();

      setSuccessMessage('Patient details successfully updated.');
      setSuccessSnackbarOpen(true);

      console.log('Successfully saved patient details:', editedPatient);
    } catch (error) {
      console.error('Error saving edited patient:', error.message);
      setErrorMessage('Failed to update patient details. Please try again.');
      setErrorSnackbarOpen(true);
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Patient List
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '16px' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredPatients
          .length === 0 ? (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
              No matches found
            </Typography>
          ) : (
            <List>
              {filteredPatients.map((patient) => (
                <ListItem key={patient.patient_number} secondaryAction={
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditPatient(patient)}>
                    <EditIcon />
                  </IconButton>
                }>
                  <ListItemText
                    primary={`${patient.first_name} ${patient.last_name}`}
                    secondary={`Patient ID: ${patient.patient_number}`}
                  />
                   <ListItemText
                    primary={` ${appointmentTypes[patient.patient_number]}`}
                  />
                  <ListItemText
                    primary={`Age: ${calculateAge(patient.date_of_birth)}`}
                  />
                  <ListItemText
                    primary={`Next of Kin: ${patient.kin_details.full_name}`}
                    secondary={`Relationship: ${patient.kin_details.relationship}`}
                  />
                 
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
  
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Patient Details</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.first_name}
              onChange={(e) => setEditedPatient({ ...editedPatient, first_name: e.target.value })}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.last_name}
              onChange={(e) => setEditedPatient({ ...editedPatient, last_name: e.target.value })}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.address}
              onChange={(e) => setEditedPatient({ ...editedPatient, address: e.target.value })}
            />
            <TextField
              label="Telephone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.telephone_number}
              onChange={(e) => setEditedPatient({ ...editedPatient, telephone_number: e.target.value })}
            />
            <TextField
              label="Sex"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.sex}
              onChange={(e) => setEditedPatient({ ...editedPatient, sex: e.target.value })}
            />
            <TextField
              label="Date of Birth"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={editedPatient.date_of_birth}
              onChange={(e) => setEditedPatient({ ...editedPatient, date_of_birth: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Marital Status"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.marital_status}
              onChange={(e) => setEditedPatient({ ...editedPatient, marital_status: e.target.value })}
            />
            <TextField
              label="Kin Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.kin_details.full_name}
              onChange={(e) => setEditedPatient({ ...editedPatient, kin_details: { ...editedPatient.kin_details, full_name: e.target.value } })}
            />
            <TextField
              label="Relationship"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.kin_details.relationship}
              onChange={(e) => setEditedPatient({ ...editedPatient, kin_details: { ...editedPatient.kin_details, relationship: e.target.value } })}
            />
            <TextField
              label="Kin Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.kin_details.address}
              onChange={(e) => setEditedPatient({ ...editedPatient, kin_details: { ...editedPatient.kin_details, address: e.target.value } })}
            />
            <TextField
              label="Kin Telephone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={editedPatient.kin_details.telephone}
              onChange={(e) => setEditedPatient({ ...editedPatient, kin_details: { ...editedPatient.kin_details, telephone: e.target.value } })}
            />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={handleSaveEditedPatient} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={handleCloseEditDialog} variant="contained" color="secondary" sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        {/* End Edit Dialog */}
  
        <Box sx={{ mt: 2, textAlign: 'center', padding: '16px' }}>
          <Button onClick={onClose} variant="contained" color="secondary">
            Close
          </Button>
        </Box>
  
        {/* Snackbar for error message */}
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setErrorSnackbarOpen(false)}
          message={errorMessage}
          severity="error"
        />
        {/* Snackbar for success message */}
        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSuccessSnackbarOpen(false)}
          message={successMessage}
          severity="success"
        />
      </Dialog>
    );
  };
  
  export default PatientListPopup;
  