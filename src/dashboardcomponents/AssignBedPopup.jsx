import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { supabase } from '../supabaseClient';
import MuiAlert from '@mui/material/Alert';

const AssignBedPopup = ({ open, onClose, onAssign }) => {
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedBed, setSelectedBed] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expectedDuration, setExpectedDuration] = useState('');
  const [dateOfExpectedLeave, setDateOfExpectedLeave] = useState('');
  const [staffOptions, setStaffOptions] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [selectedWaitingListId, setSelectedWaitingListId] = useState('');

  useEffect(() => {
    fetchWards();
    fetchWaitingList(); // Fetch waiting list independently
  }, []);

  const fetchWards = async () => {
    try {
      let { data: wardsData, error: wardsError } = await supabase.from('ward').select('*');
      if (wardsError) throw wardsError;

      // Map each ward to its beds for easy access
      const wardsWithBeds = wardsData.map((ward) => ({
        ...ward,
        beds: [],
      }));

      setWards(wardsWithBeds);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wards:', error.message);
      setError('Error fetching wards. Please try again.');
    }
  };

  const fetchBedsByWard = async (wardNumber) => {
    try {
      let { data: bedsData, error: bedsError } = await supabase.rpc('get_beds_by_ward', {
        ward_number_param: wardNumber,
      });

      if (bedsError) throw bedsError;

      return bedsData;
    } catch (error) {
      console.error('Error fetching beds:', error.message);
      throw error;
    }
  };

  const fetchStaffAssignedToWard = async (wardNumber) => {
    try {
      let { data: staffData, error: staffError } = await supabase
        .from('staff_assigned_to_ward')
        .select('staff_number')
        .eq('ward_number', wardNumber);

      if (staffError) throw staffError;

      // Extract staff numbers from the response data
      const staffNumbers = staffData.map((staff) => staff.staff_number);

      // Fetch detailed staff information using the staff numbers
      let { data: detailedStaffData, error: detailedStaffError } = await supabase
        .from('staff')
        .select('*')
        .in('staff_number', staffNumbers);

      if (detailedStaffError) throw detailedStaffError;

      return detailedStaffData;
    } catch (error) {
      console.error('Error fetching staff assigned to ward:', error.message);
      throw error;
    }
  };

  const fetchWaitingList = async () => {
    try {
      let { data: waitingListData, error: waitingListError } = await supabase
        .from('waitinglist')
        .select('*')
        .or('status.is.null,status.neq.done'); // Exclude entries with status "done"
        
      if (waitingListError) throw waitingListError;

      setWaitingList(waitingListData);
    } catch (error) {
      console.error('Error fetching waiting list:', error.message);
      setError('Error fetching waiting list. Please try again.');
    }
  };

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleWardChange = async (event) => {
    const selectedWardNumber = event.target.value;
    setSelectedWard(selectedWardNumber);
    setSelectedBed('');
    setSelectedStaff('');

    try {
      // Fetch beds for the selected ward
      const bedsData = await fetchBedsByWard(selectedWardNumber);

      // Update the beds for the selected ward in the state
      const updatedWards = wards.map((ward) =>
        ward.ward_number === selectedWardNumber ? { ...ward, beds: bedsData } : ward
      );

      setWards(updatedWards);

      // Select the first bed by default if available
      if (bedsData.length > 0) {
        setSelectedBed(bedsData[0].bed_number);
      } else {
        console.warn('No beds available for the selected ward.');
      }

      // Fetch staff assigned to the selected ward
      const staffData = await fetchStaffAssignedToWard(selectedWardNumber);

      // Update staff options in the state
      setStaffOptions(
        staffData.map((staff) => ({
          value: staff.staff_number,
          label: `${staff.first_name} ${staff.last_name}`,
        }))
      );
    } catch (error) {
      console.error('Error fetching beds or staff assigned to ward:', error.message);
      // Handle fetch error gracefully, e.g., set error state or display a message
    }
  };

  const handleAssignBed = async () => {
    try {
      // Fetch the patient_number from waitinglist based on list_id
      const { data: waitingListItem, error: waitingListError } = await supabase
        .from('waitinglist')
        .select('patient_number')
        .eq('list_id', selectedWaitingListId) // Use selectedWaitingListId here
        .single(); // Use .single() to ensure only one row is returned
  
      if (waitingListError) {
        throw waitingListError;
      }
  
      if (!waitingListItem) {
        throw new Error('No waiting list item found for the given list ID');
      }
  
      const patientNumber = waitingListItem.patient_number;
  
      // Ensure you have all required fields filled and handle assignment logic
      await supabase
        .from('in_patient')
        .insert([
          {
            list_id: selectedWaitingListId, // Assign list_id from state
            patient_number: patientNumber, // Assign patient number from waitinglist
            bed_number: selectedBed,
            staff_number: selectedStaff,
            expected_duration_of_stay: expectedDuration,
            date_placed_in_ward: new Date().toISOString().split('T')[0],
            date_of_expected_leave: dateOfExpectedLeave,
          },
        ]);

      // Update the status in the waitinglist table
      const { error: updateError } = await supabase
        .from('waitinglist')
        .update({ status: 'done' })
        .eq('list_id', selectedWaitingListId);

      if (updateError) {
        throw updateError;
      }
  
      onClose(); // Close the dialog
      onAssign(); // Update waiting list and in-patients
      handleSnackbarOpen('success', 'Bed assigned successfully!');
    } catch (error) {
      console.error('Error assigning bed or updating waiting list status:', error.message);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error assigning bed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Bed</DialogTitle>
      <DialogContent>
      <TextField
          label="Waiting List ID"
          select
          fullWidth
          value={selectedWaitingListId}
          onChange={(e) => setSelectedWaitingListId(e.target.value)}
        >
          {waitingList.map((item) => (
            <MenuItem key={item.list_id} value={item.list_id}>
              {item.list_id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Ward Number"
          select
          fullWidth
          value={selectedWard}
          onChange={handleWardChange}
        >
          {wards.map((ward) => (
            <MenuItem key={ward.ward_number} value={ward.ward_number}>
              {ward.ward_number}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Bed Number"
          select
          fullWidth
          disabled={!selectedWard}
          value={selectedBed}
          onChange={(e) => setSelectedBed(e.target.value)}
        >
          {selectedWard &&
            wards
              .find((ward) => ward.ward_number === selectedWard)
              ?.beds.map((bed) => (
                <MenuItem key={bed.bed_number} value={bed.bed_number}>
                  {bed.bed_number}
                </MenuItem>
              ))}
        </TextField>

        <TextField
          label="Select Staff"
          select
          fullWidth
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
        >
          {staffOptions.map((staff) => (
            <MenuItem key={staff.value} value={staff.value}>
              {staff.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Expected Duration of Stay (days)"
          type="number"
          fullWidth
          value={expectedDuration}
          onChange={(e) => setExpectedDuration(e.target.value)}
        />
        <TextField
          label="Date of Expected Leave"
          type="date"
          fullWidth
          value={dateOfExpectedLeave}
          onChange={(e) => setDateOfExpectedLeave(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAssignBed}
          color="primary"
          variant="contained"
          disabled={
            !selectedWard ||
            !selectedBed ||
            !selectedStaff ||
            !expectedDuration ||
            !dateOfExpectedLeave ||
            !selectedWaitingListId
          }
        >
          Assign Bed
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Dialog>
  );
};

export default AssignBedPopup;
