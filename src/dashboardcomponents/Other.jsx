import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography, IconButton, Snackbar, SnackbarContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ExpandableForm from './ExpandableForm';
import { supabase } from '../supabaseClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
const Other = () => {
  const [localDoctorInfo, setLocalDoctorInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editData, setEditData] = useState({
    doctor_id: null,
    clinic_number: '',
    doctor_name: '',
    address: '',
    telephone: ''
  });

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchLocalDoctorInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('localdoctor')
          .select('doctor_id, doctor_name, address, telephone, clinic_number')
          .order('clinic_number'); // Order by clinic_number ascending

        if (error) {
          throw error;
        }

        console.log('Fetched data:', data);
        setLocalDoctorInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchLocalDoctorInfo();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      const { data: patientsCount, error: patientsCountError } = await supabase
        .from('patient')
        .select('count', { count: 'exact' })
        .eq('doctor_id', doctorId);

      if (patientsCountError) {
        throw patientsCountError;
      }

      const patientCount = patientsCount[0].count;

      if (patientCount > 0) {
        throw new Error(`Cannot delete doctor. ${patientCount} patients are referenced to this doctor.`);
      }

      const { error: deleteError } = await supabase
        .from('localdoctor')
        .delete()
        .eq('doctor_id', doctorId);

      if (deleteError) {
        throw deleteError;
      }

      console.log('Doctor deleted successfully.');
      const updatedDoctors = localDoctorInfo.filter(doctor => doctor.doctor_id !== doctorId);
      setLocalDoctorInfo(updatedDoctors);
      setDeleteDialogOpen(false);
      setDeleteDoctorId(null);
      setDeleteError(null);

      // Show success snackbar
      handleSnackbarOpen('success', 'Doctor deleted successfully.');
    } catch (error) {
      console.error('Error deleting doctor:', error.message);
      setDeleteError(error.message);

      // Show error snackbar
      handleSnackbarOpen('error', `Error deleting doctor: ${error.message}`);
    }
  };

  const handleEnableEdit = (doctor) => {
    setEditMode(true);
    setEditDoctorId(doctor.doctor_id);
    setEditData({
      doctor_id: doctor.doctor_id,
      clinic_number: doctor.clinic_number,
      doctor_name: doctor.doctor_name,
      address: doctor.address,
      telephone: doctor.telephone
    });
  };

  const handleDisableEdit = () => {
    setEditMode(false);
    setEditDoctorId(null);
    setEditData({
      doctor_id: null,
      clinic_number: '',
      doctor_name: '',
      address: '',
      telephone: ''
    });
  };

  const handleOpenDeleteDialog = (doctorId) => {
    setDeleteDialogOpen(true);
    setDeleteDoctorId(doctorId);
    setDeleteError(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteDoctorId(null);
    setDeleteError(null);
  };

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEditInputChange = (field, value) => {
    setEditData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('localdoctor')
        .update(editData)
        .eq('doctor_id', editData.doctor_id);

      if (error) {
        throw error;
      }

      console.log(`Doctor ${editData.doctor_id} updated successfully.`);
      const updatedDoctors = localDoctorInfo.map(doctor => {
        if (doctor.doctor_id === editData.doctor_id) {
          return { ...doctor, ...editData };
        }
        return doctor;
      });
      setLocalDoctorInfo(updatedDoctors);

      // Show success snackbar
      handleSnackbarOpen('success', `Doctor ${editData.doctor_id} updated successfully.`);
    } catch (error) {
      console.error(`Error updating doctor ${editData.doctor_id}:`, error.message);
      setError(error.message);

      // Show error snackbar
      handleSnackbarOpen('error', `Error updating doctor ${editData.doctor_id}: ${error.message}`);
    } finally {
      setLoading(false);
      handleDisableEdit(); // Disable edit mode after saving
    }
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3}>
          <div className="icon" style={{ display: 'flex' }}>
            <div style={{ margin: '8px' }}>
              <img src="../../img/other.png" alt="Patient" />
            </div>
          </div>
        </Paper>
        <ExpandableForm title="Local Doctor Information">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {loading && <CircularProgress />}
              {error && <Typography color="error">Failed to load data: {error}</Typography>}
              {!loading && !error && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Clinic Number</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Telephone Number</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localDoctorInfo.map((doctor) => (
                        <TableRow key={doctor.doctor_id}>
                          <TableCell>
                            {editMode && editDoctorId === doctor.doctor_id ?
                              <TextField
                                type="text"
                                value={editData.clinic_number}
                                onChange={(e) => handleEditInputChange('clinic_number', e.target.value)}
                              />
                              :
                              <Typography>{doctor.clinic_number}</Typography>
                            }
                          </TableCell>
                          <TableCell>
                            {editMode && editDoctorId === doctor.doctor_id ?
                              <TextField
                                type="text"
                                value={editData.doctor_name}
                                onChange={(e) => handleEditInputChange('doctor_name', e.target.value)}
                              />
                              :
                              <Typography>{doctor.doctor_name}</Typography>
                            }
                          </TableCell>
                          <TableCell>
                            {editMode && editDoctorId === doctor.doctor_id ?
                              <TextField
                                type="text"
                                value={editData.address}
                                onChange={(e) => handleEditInputChange('address', e.target.value)}
                              />
                              :
                              <Typography>{doctor.address}</Typography>
                            }
                          </TableCell>
                          <TableCell>
                            {editMode && editDoctorId === doctor.doctor_id ?
                              <TextField
                                type="text"
                                value={editData.telephone}
                                onChange={(e) => handleEditInputChange('telephone', e.target.value)}
                              />
                              :
                              <Typography>{doctor.telephone}</Typography>
                            }
                          </TableCell>
                          <TableCell>
                            {editMode && editDoctorId === doctor.doctor_id ?
                              <>
                                <Button color="primary" onClick={handleSaveEdit}>
                                  Save
                                </Button>
                                <Button color="secondary" onClick={handleDisableEdit}>
                                  Cancel
                                </Button>
                              </>
                              :
                              <>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => handleEnableEdit(doctor)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleOpenDeleteDialog(doctor.doctor_id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>
        </ExpandableForm>
        <ExpandableForm title="About Us">
          <
          Grid container spacing={1}>
            <p style={{ textAlign: 'justify' }}>
              Wellmeadows Hospital, situated in the heart of Edinburgh, UK, is a premier healthcare facility renowned for its exceptional patient care and state-of-the-art medical services. Our dedicated team of skilled professionals employs the latest medical technologies and innovative treatments across various specialties, including cardiology, oncology, orthopedics, and pediatrics. Committed to personalized and compassionate care, Wellmeadows Hospital provides a supportive and healing environment for all patients. Conveniently located, we strive to stay at the forefront of medical advancements, ensuring the highest standards of health and well-being for the Edinburgh community.
            </p>
          </Grid>
        </ExpandableForm>
      </Box>
      {/* Snackbar for success and error messages */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          style={{ backgroundColor: snackbarSeverity === 'success' ? '#43a047' : '#d32f2f' }}
          message={
            <span id="client-snackbar">
              {snackbarMessage}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this doctor?
          </Typography>
          {deleteError && <Typography color="error">{deleteError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteDoctorId)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Other;
