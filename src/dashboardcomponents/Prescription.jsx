import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Button,
  TextField,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ExpandableForm from './ExpandableForm';  // Adjust path as per your project structure
import { supabase } from '../supabaseClient';  // Adjust path as per your project structure
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b61b8', 
    },
    secondary: {
      main: '#C40C0C',
    }
  },
});

const Prescription = () => {
  const [prescriptionInfo, setPrescriptionInfo] = useState({
    patientId: '',
    patientName: '',
    drug: '',
    startDate: '',
    endDate: '',
    unitsPerDay: 1,
  });

  const [administeredPrescriptions, setAdministeredPrescriptions] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchWards();
        await fetchPrescriptions();
        setLoading(false);
      } catch (error) {
        console.error('Error in fetching data:', error);
        setLoading(false);
        handleSnackbarOpen('error', 'Error fetching data. Please try again.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchInPatients();
  }, []);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchInPatients = async () => {
    try {
      let { data, error } = await supabase
        .from('in_patient')
        .select('*, patient:patient_number(first_name, last_name)');

      if (error) throw error;

      const enhancedData = data.map(patient => ({
        ...patient,
        patientName: `${patient.patient.first_name} ${patient.patient.last_name}`,
      }));

      const filteredInPatients = enhancedData.filter(patient => !patient.date_of_actual_leave);
      setInPatients(filteredInPatients);
    } catch (error) {
      console.error('Error fetching in-patients:', error.message);
      handleSnackbarOpen('error', 'Error fetching in-patients. Please try again.');
    }
  };

  const fetchPrescriptions = async () => {
    try {
      let { data, error } = await supabase.from('patient_medication').select('*');
      if (error) throw error;
      setAdministeredPrescriptions(data);
      console.log('Fetched medications:', data); // Logging medications
    } catch (error) {
      console.error('Error fetching medications:', error.message);
      handleSnackbarOpen('error', 'Error fetching medications. Please try again.');
    }
  };

  const fetchWards = async () => {
    try {
      let { data, error } = await supabase.from('ward').select('ward_number, ward_name');
      if (error) throw error;
      setWards(data);
      console.log('Fetched wards:', data); // Logging wards
    } catch (error) {
      console.error('Error fetching wards:', error.message);
      handleSnackbarOpen('error', 'Error fetching wards. Please try again.');
    }
  };

  const fetchDrugs = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmaceutical_supply')
        .select(`
          drug_number, 
          supply_id,
          supply (supply_name)
        `);

      if (error) throw error;

      const flattenedData = data.map(drug => ({
        drug_number: drug.drug_number,
        supply_id: drug.supply_id,
        supply_name: drug.supply.supply_name
      }));

      setDrugs(flattenedData);
    } catch (error) {
      console.error('Error fetching drugs:', error.message);
      handleSnackbarOpen('error', 'Error fetching drugs. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionInfo(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'patientId') {
      const selectedPatient = inPatients.find(patient => patient.patient_number === value);
      if (selectedPatient) {
        setPrescriptionInfo(prev => ({
          ...prev,
          patientName: selectedPatient.patientName,
        }));
      }
    }
  };

  const handleCreatePrescriptionSubmit = async () => {
    try {
      // Form validation
      if (!prescriptionInfo.patientId || !prescriptionInfo.drug || !prescriptionInfo.startDate || !prescriptionInfo.endDate) {
        throw new Error('Please fill all required fields.');
      }

      if (new Date(prescriptionInfo.startDate) > new Date(prescriptionInfo.endDate)) {
        throw new Error('End Date must be after Start Date.');
      }

      // Open confirmation dialog
      setConfirmationOpen(true);
    } catch (error) {
      console.error('Error creating medication record:', error.message);
      handleSnackbarOpen('error', `Error creating medication record: ${error.message}`);
    }
  };

  const confirmSubmit = async () => {
    try {
      setSubmitting(true);
      setConfirmationOpen(false);

      const formattedStartDate = new Date(prescriptionInfo.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(prescriptionInfo.endDate).toISOString().split('T')[0];

      // Validate patient number existence
      let { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('*')
        .eq('patient_number', prescriptionInfo.patientId);

      if (patientError || patientData.length === 0) {
        throw new Error('Invalid patient ID.');
      }

      let { data, error } = await supabase
        .from('patient_medication')
        .insert([
          {
            patient_number: prescriptionInfo.patientId,
            drug_number: getDrugNumberByName(prescriptionInfo.drug),
            units_per_day: prescriptionInfo.unitsPerDay,
            med_start: formattedStartDate,
            med_finish: formattedEndDate,
          },
        ]);

      if (error) throw error;

      handleSnackbarOpen('success', 'Medication record created successfully.');
      fetchPrescriptions(); // Refresh medication list
      setPrescriptionInfo({
        patientId: '',
        patientName: '',
        drug: '',
        startDate: '',
        endDate: '',
        unitsPerDay: 1,
      });
    } catch (error) {
      console.error('Error creating medication record:', error.message);
      handleSnackbarOpen('error', `Error creating medication record: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelSubmit = () => {
    setConfirmationOpen(false);
  };

  const getWardNameByNumber = (wardNumber) => {
    const foundWard = wards.find((ward) => ward.ward_number === wardNumber);
    return foundWard ? foundWard.ward_name : '';
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
    setSuccessMessage('');
  };

  const getDrugNameById = (drugId) => {
    const drug = drugs.find(drug => drug.drug_number === drugId);
    return drug ? drug.supply_name : '';
  };
  
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
    <div>
    <Box sx={{ p: 3 }}>
        <Paper elevation={3}>
          <div className="icon" style={{ display: 'flex' }}>
            <div style={{ margin: '8px' }}>
              <img src="../../img/prescription.jpg" alt="Prescription" />
            </div>
          </div>
        </Paper>
     
        {/* Create Prescription Form */}
        <ExpandableForm title="Create Prescription" onSubmit={handleCreatePrescriptionSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Patient"
                variant="outlined"
                fullWidth
                select
                required
                size="small"
                name="patientId"
                value={prescriptionInfo.patientId}
                onChange={handleInputChange}
              >
                {inPatients.length === 0 ? (
                  <MenuItem value="">
                    No patients available
                  </MenuItem>
                ) : (
                  inPatients.map((inPatient) => (
                    <MenuItem key={inPatient.inpatient_id} value={inPatient.patient_number}>
                      {`${inPatient.patientName} (${inPatient.patient_number})`}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Drug"
                variant="outlined"
                fullWidth
                select
                required
                size="small"
                name="drug"
                value={prescriptionInfo.drug}
                onChange={handleInputChange}
              >
                {drugs.map((drug) => (
                  <MenuItem key={drug.drug_number} value={drug.supply_name}>
                    {drug.supply_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Units Per Day"
                variant="outlined"
                fullWidth
                required
                size="small"
                name="unitsPerDay"
                type="number"
                value={prescriptionInfo.unitsPerDay}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                variant="outlined"
                fullWidth
                required
                size="small"
                name="startDate"
                type="date"
                value={prescriptionInfo.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                variant="outlined"
                fullWidth
                required
                size="small"
                name="endDate"
                type="date"
                value={prescriptionInfo.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </ExpandableForm>
        {/* Confirmation Dialog */}
        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogTitle>Confirm Prescription Submission</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to submit this prescription?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelSubmit} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmSubmit} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {/* Medication List */}
        <ExpandableForm title="Prescriptions" >
        <Paper elevation={3} style={{ marginTop: '20px' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Number</TableCell>
                  <TableCell>Drug</TableCell>
                  <TableCell>Units/Day</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {administeredPrescriptions.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell>{medication.patient_number}</TableCell>
                    <TableCell>{getDrugNameById(medication.drug_number)}</TableCell>
                    <TableCell>{medication.units_per_day}</TableCell>
                    <TableCell>{medication.med_start}</TableCell>
                    <TableCell>{medication.med_finish}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Paper>
        </ExpandableForm>
    
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
    </div>
    </ThemeProvider>
  );
};

export default Prescription;

