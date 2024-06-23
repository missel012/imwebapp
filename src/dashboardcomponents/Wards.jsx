import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  MenuItem,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ExpandableForm from './ExpandableForm';
import AssignBedPopup from './AssignBedPopup';
import { supabase } from '../supabaseClient';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const Wards = () => {
  const [newAssignment, setNewAssignment] = useState({
    ward_number: '',
    staff_number: '',
    shift: '',
  });

  const [wards, setWards] = useState([]);
  const [eligibleStaff, setEligibleStaff] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openAssignPopup, setOpenAssignPopup] = useState(false);
  const [patientNames, setPatientNames] = useState({});
  const [editableRows, setEditableRows] = useState({});
  const [expectedWaitTime, setExpectedWaitTime] = useState('');

  useEffect(() => {
    fetchWards();
    fetchEligibleStaff();
    fetchWaitingList();
    fetchPatientNames();
    fetchInPatients();
  }, []);

  const fetchWards = async () => {
    try {
      let { data, error } = await supabase.from('ward').select('ward_number, ward_name');
      if (error) throw error;
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error.message);
      handleSnackbarOpen('error', 'Error fetching wards. Please try again.');
    }
  };

  const fetchEligibleStaff = async () => {
    try {
      let { data, error } = await supabase.rpc('get_eligible_staff_for_allocation');
      if (error) throw error;
      setEligibleStaff(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching eligible staff members:', error.message);
      handleSnackbarOpen('error', 'Error fetching eligible staff members. Please try again.');
    }
  };

  const fetchWaitingList = async () => {
    try {
      let { data, error } = await supabase.from('waitinglist').select('*');
      if (error) throw error;
      setWaitingList(data);
      const initialEditableRows = {};
      data.forEach((row) => {
        initialEditableRows[row.list_id] = false;
      });
      setEditableRows(initialEditableRows);
    } catch (error) {
      console.error('Error fetching waiting list:', error.message);
      handleSnackbarOpen('error', 'Error fetching waiting list. Please try again.');
    }
  };

  const fetchPatientNames = async () => {
    try {
      let { data, error } = await supabase.from('patient').select('patient_number, first_name, last_name');
      if (error) throw error;

      const patientNamesMap = {};
      data.forEach((patient) => {
        const fullName = `${patient.first_name} ${patient.last_name}`;
        patientNamesMap[patient.patient_number] = fullName;
      });
      setPatientNames(patientNamesMap);
    } catch (error) {
      console.error('Error fetching patient names:', error.message);
      handleSnackbarOpen('error', 'Error fetching patient names. Please try again.');
    }
  };

  const fetchInPatients = async () => {
    try {
      let { data, error } = await supabase.from('in_patient').select('*');
      if (error) throw error;
      setInPatients(data);
    } catch (error) {
      console.error('Error fetching in-patients:', error.message);
      handleSnackbarOpen('error', 'Error fetching in-patients. Please try again.');
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.ward_number || !newAssignment.staff_number || !newAssignment.shift) {
      handleFetchError('Invalid. Please fill in all information.');
      return;
    }

    try {
      let { data, error } = await supabase
        .from('staff_assigned_to_ward')
        .insert([
          {
            ward_number: newAssignment.ward_number,
            staff_number: newAssignment.staff_number,
            shift: newAssignment.shift,
          },
        ]);
      if (error) throw error;
      handleFetchSuccess(`Successfully assigned staff ${newAssignment.staff_number} to ward ${newAssignment.ward_number}.`);
      setNewAssignment({
        ward_number: '',
        staff_number: '',
        shift: '',
      });
      fetchEligibleStaff();
    } catch (error) {
      console.error('Error adding assignment:', error.message);
      handleFetchError(`Error assigning staff: ${error.message}`);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCellEdit = async (newValue, id, columnName) => {
    try {
      await supabase
        .from('waitinglist')
        .update({ [columnName]: newValue })
        .eq('list_id', id);
      handleSnackbarOpen('success', 'Successfully updated.');
      fetchWaitingList();
    } catch (error) {
      console.error('Error updating cell:', error.message);
      handleSnackbarOpen('error', `Error updating cell: ${error.message}`);
    }
  };

  const handleDelayedSaveWaitTime = async (id, value) => {
    try {
      await supabase
        .from('waitinglist')
        .update({ expected_wait_time: value })
        .eq('list_id', id);
      handleSnackbarOpen('success', 'Successfully updated expected wait time.');
      fetchWaitingList();
    } catch (error) {
      console.error('Error updating expected wait time:', error.message);
      handleSnackbarOpen('error', `Error updating expected wait time: ${error.message}`);
    }
  };

  const toggleEditMode = (id) => {
    setEditableRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setExpectedWaitTime(value);
    }
  };

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSuccessMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setError(null);
    setSuccessMessage('');
  };

  const handleOpenAssignPopup = () => {
    setOpenAssignPopup(true);
  };

  const handleCloseAssignPopup = () => {
    setOpenAssignPopup(false);
  };

  const handleFetchError = (message) => {
    setError(message);
    handleSnackbarOpen('error', message);
  };

  const handleFetchSuccess = (message) => {
    setSuccessMessage(message);
    handleSnackbarOpen('success', message);
  };

  const handleAssign = () => {
    fetchWaitingList();
    fetchInPatients();
    handleCloseAssignPopup();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3}>
        {/* Your paper content here */}
      </Paper>

      {/* First Expandable Form: Allocate Staff to Ward */}
      <ExpandableForm title="Allocate Staff to Ward">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="ward_number"
              label="Select Ward"
              variant="outlined"
              fullWidth
              required
              size="small"
              select
              value={newAssignment.ward_number}
              onChange={handleFieldChange}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.ward_number} value={ward.ward_number}>
                  {`${ward.ward_number} - ${ward.ward_name}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="staff_number"
              label="Select Staff"
              variant="outlined"
              fullWidth
              required
              size="small"
              select
              value={newAssignment.staff_number}
                onChange={handleFieldChange}
                >
                  {eligibleStaff.map((staff) => (
                    <MenuItem key={staff.staff_number} value={staff.staff_number}>
                      {`${staff.staff_number} - ${staff.first_name} ${staff.last_name}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="shift"
                  label="Select Shift"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  select
                  value={newAssignment.shift}
                  onChange={handleFieldChange}
                >
                  <MenuItem value={'Early'}>Early</MenuItem>
                  <MenuItem value={'Late'}>Late</MenuItem>
                  <MenuItem value={'Night'}>Night</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddAssignment}
                  >
                    Allocate Staff
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ExpandableForm>
    
          {/* Second Expandable Form: Waiting List */}
          <ExpandableForm title="Waiting List">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>List ID</TableCell>
                    <TableCell>Patient Number</TableCell>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Date Placed on Waiting List</TableCell>
                    <TableCell>Expected Wait Time (hours)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waitingList.map((row) => (
                    <TableRow key={row.list_id}>
                      <TableCell>{row.list_id}</TableCell>
                      <TableCell>{row.patient_number}</TableCell>
                      <TableCell>{patientNames[row.patient_number]}</TableCell>
                      <TableCell>
                        {editableRows[row.list_id] ? (
                          <TextField
                            type="date"
                            variant="outlined"
                            size="small"
                            value={row.date_placed_on_waiting_list}
                            onChange={(e) =>
                              handleCellEdit(
                                e.target.value,
                                row.list_id,
                                'date_placed_on_waiting_list'
                              )
                            }
                          />
                        ) : (
                          row.date_placed_on_waiting_list
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[row.list_id] ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={expectedWaitTime}
                            onChange={handleInputChange}
                          />
                        ) : (
                          row.expected_wait_time
                        )}
                      </TableCell>
                      <TableCell>
                        {editableRows[row.list_id] ? (
                          <IconButton
                            color="primary"
                            onClick={() => {
                              handleDelayedSaveWaitTime(
                                row.list_id,
                                expectedWaitTime
                              );
                              toggleEditMode(row.list_id);
                            }}
                          >
                            <CheckIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() => toggleEditMode(row.list_id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleOpenAssignPopup}
              >
                Assign Bed
              </Button>
            </Box>
          </ExpandableForm>
    
          {/* Third Expandable Form: Current Inpatients */}
          <ExpandableForm title="Current Inpatients">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Number</TableCell>
                    <TableCell>Bed Number</TableCell>
                    <TableCell>Assigned Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inPatients.map((inPatient) => (
                    <TableRow key={inPatient.patient_number}>
                      <TableCell>{inPatient.patient_number}</TableCell>
                      <TableCell>{inPatient.bed_number}</TableCell>
                      <TableCell>{inPatient.assigned_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ExpandableForm>
    
          {/* Popup for Assigning a Bed */}
          <AssignBedPopup
            open={openAssignPopup}
            onClose={handleCloseAssignPopup}
            title="Assign Bed"
            onAssign={handleAssign}
          />
    
          {/* Snackbar for success and error messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
            >
              {successMessage || error}
            </MuiAlert>
          </Snackbar>
    
          {/* Display error message */}
          {error && (
            <Box sx={{ mt: 2, textAlign: 'center', color: 'red' }}>{error}</Box>
          )}
        </Box>
      );
    };
    
    export default Wards;
    