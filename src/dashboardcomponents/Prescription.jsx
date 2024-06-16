import React, { useState } from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Prescription = () => {
  const [prescriptionInfo, setPrescriptionInfo] = useState({
    patientName: '',
    drug: '',
    startDate: '',
    endDate: '',
    unitsPerDay: 1,
  });

  const [administeredPrescriptions, setAdministeredPrescriptions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePrescriptionSubmit = (e) => {
    e.preventDefault();
    const newPrescription = { ...prescriptionInfo };
    setAdministeredPrescriptions((prev) => [...prev, newPrescription]);
    // Clear input fields after submission
    setPrescriptionInfo({
      patientName: '',
      drug: '',
      startDate: '',
      endDate: '',
      unitsPerDay: 1,
    });
  };

  const handleAdministerSubmit = (e) => {
    e.preventDefault();
    setAdministeredPrescriptions((prev) => [...prev, { ...prescriptionInfo }]);
  };

  const formatPrescriptionDetails = () => {
    const { drug, unitsPerDay, startDate, endDate } = prescriptionInfo;
    if (drug && unitsPerDay && startDate && endDate) {
      return `Drug: ${drug}, Units/Day: ${unitsPerDay}, Start Date: ${startDate}, End Date: ${endDate}`;
    } else {
      return "Please fill in all fields";
    }
  };

  return (
    <div>
      <Paper elevation={3}>
        <div className="icon" style={{ display: 'flex' }}>
          <div style={{ margin: '8px' }}>
            <img src="../../img/prescription.jpg" alt="Prescription" />
          </div>
          <div>
            <h2 style={{ marginLeft: '10px' }}>Prescription</h2>
          </div>
        </div>
      </Paper>
      <div style={{ margin: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <span><b>In-Patient</b></span>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Patient Name"
              variant="outlined"
              fullWidth
              select
              required
              size="small"
              name="patientName"
              value={prescriptionInfo.patientName}
              onChange={handleInputChange}
            >
              <MenuItem value="name1">Name 1</MenuItem>
              <MenuItem value="name2">Name 2</MenuItem>
              <MenuItem value="name3">Name 3</MenuItem>
            </TextField>
          </Grid>
        </div>
        <ExpandableForm title="Prescription Information">
          <form onSubmit={handleCreatePrescriptionSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Drug</InputLabel>
                  <Select
                    label="Drug"
                    name="drug"
                    value={prescriptionInfo.drug}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Actifed Dry Coughs - 48 puffs">Actifed Dry Coughs - 48 puffs</MenuItem>
                    <MenuItem value="Paracetamol">Paracetamol</MenuItem>
                    <MenuItem value="Tuseran">Tuseran</MenuItem>
                    <MenuItem value="Sleeping Pills">Sleeping Pills</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={prescriptionInfo.startDate}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={prescriptionInfo.endDate}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Units Per Day"
                  type="number"
                  name="unitsPerDay"
                  value={prescriptionInfo.unitsPerDay}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 1 }} // Added to prevent negative values
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button type="submit" variant="contained" color="primary">
                    Create Prescription
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </ExpandableForm>
        <ExpandableForm title="Administer Prescription">
          <form onSubmit={handleAdministerSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Prescription Details"
                  value={formatPrescriptionDetails()}
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button type="submit" variant="contained" color="primary">
                    Administer Prescription
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </ExpandableForm>
        <ExpandableForm title="Prescription History">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Drug</TableCell>
                  <TableCell>Units/Day</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {administeredPrescriptions.map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>{prescription.drug}</TableCell>
                    <TableCell>{prescription.unitsPerDay}</TableCell>
                    <TableCell>{prescription.startDate}</TableCell>
                    <TableCell>{prescription.endDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpandableForm>
      </div>
    </div>
  );
};

export default Prescription;