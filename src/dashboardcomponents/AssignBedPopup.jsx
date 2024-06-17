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

const AssignBedPopup = ({ open, onClose }) => {
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedBed, setSelectedBed] = useState('');
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      let { data, error } = await supabase.from('ward').select('*');
      if (error) throw error;

      for (const ward of data) {
        const { data: bedsData, error: bedsError } = await supabase
          .from('bed')
          .select('bed_number')
          .eq('ward_number', ward.ward_number);

        if (bedsError) throw bedsError;

        ward.beds = bedsData;
      }

      setWards(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wards and beds:', error.message);
      setError('Error fetching wards and beds. Please try again.');
    }
  };

  const handleAssignBed = async () => {
    try {
      if (!selectedWard || !selectedBed) {
        throw new Error('Please select a ward and a bed number.');
      }

      const { data: waitingListEntry, error } = await supabase
        .from('waitinglist')
        .select('*')
        .eq('ward_number', selectedWard);
      if (error) throw error;

      const { data: inPatientData, inPatientError } = await supabase
        .from('inpatient')
        .insert([
          {
            inpatient_id: generateInpatientId(),
            patient_number: waitingListEntry[0]?.patient_number,
            appointment_number: waitingListEntry[0]?.appointment_number,
            bed_number: selectedBed,
            expected_duration_of_stay: waitingListEntry[0]?.expected_wait_time,
            date_placed_in_ward: new Date(),
            date_of_expected_leave: new Date(),
            date_of_actual_leave: null,
            list_id: waitingListEntry[0]?.list_id,
          },
        ]);
      if (inPatientError) throw inPatientError;

      await supabase.from('waitinglist').delete().eq('list_id', waitingListEntry[0]?.list_id);

      setSnackbarSeverity('success');
      setSnackbarMessage(`Assigned bed ${selectedBed} in ward ${selectedWard} to inpatient.`);
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error('Error assigning bed:', error.message);
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error assigning bed: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleWardChange = (event) => {
    const selectedWardNumber = event.target.value;
    setSelectedWard(selectedWardNumber);
    setSelectedBed('');
  };

  const generateInpatientId = () => {
    return `INP-${Math.random().toString(36).substr(2, 9)}`;
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
          label="Ward Number"
          value={selectedWard}
          fullWidth
          disabled
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAssignBed}
          color="primary"
          disabled={!selectedWard || !selectedBed}
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
