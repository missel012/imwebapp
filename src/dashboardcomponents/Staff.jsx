import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Grid, MenuItem, Select, InputLabel, FormControl, TextField, Snackbar, SnackbarContent } from '@mui/material';
import ExpandableForm from './ExpandableForm';
import { supabase } from '../supabaseClient';
import StaffListPopup from './StaffListPopup';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b61b8',
    },
    secondary: {
      main: '#8B0000',
    }
  },
});

const Staff = () => {
  const [positions, setPositions] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [staffListPopupOpen, setStaffListPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data: positionsData, error } = await supabase
          .from('staffposition')
          .select('position_id, position_name');

        if (error) {
          throw error;
        }

        setPositions(positionsData || []);
      } catch (error) {
        console.error('Error fetching positions:', error.message);
      }
    };

    const fetchStaffMembers = async () => {
      try {
        const { data: staffData, error } = await supabase
          .from('staff')
          .select('staff_number, first_name, last_name');

        if (error) {
          throw error;
        }

        setStaffMembers(staffData || []);
      } catch (error) {
        console.error('Error fetching staff members:', error.message);
      }
    };

    fetchPositions();
    fetchStaffMembers();
  }, []);

  const [staffInfo, setStaffInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    sex: '',
    telephone: '',
    nin: '',
    dateOfBirth: '',
    position: ''
  });

  const handleStaffInfoChange = (event) => {
    setStaffInfo({
      ...staffInfo,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitStaffInfo = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([
          {
            first_name: staffInfo.firstName,
            last_name: staffInfo.lastName,
            address: staffInfo.address,
            sex: staffInfo.sex,
            telephone: staffInfo.telephone,
            nin: staffInfo.nin,
            date_of_birth: staffInfo.dateOfBirth,
            position_id: staffInfo.position
          }
        ]);

      if (error) {
        throw error;
      }

      console.log('Submitted Staff Info:', data); // Log response from Supabase

      // Clear the form fields after successful submission
      setStaffInfo({
        firstName: '',
        lastName: '',
        address: '',
        sex: '',
        telephone: '',
        nin: '',
        dateOfBirth: '',
        position: ''
      });

      setSuccessMessage('Staff added successfully');
      setErrorMessage('');

      setSnackbarSeverity('success');
      setSnackbarMessage('Staff added successfully');
      setOpenSnackbar(true);

    } catch (error) {
      console.error('Error inserting staff info:', error.message);
      setErrorMessage('Failed to add staff. Please try again later.');
      setSuccessMessage('');

      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add staff. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const [workExperience, setWorkExperience] = useState({
    selectStaff: '',
    positionName: '',
    startDate: '',
    finishDate: '',
    organization: ''
  });

  const handleWorkExperienceChange = (event) => {
    setWorkExperience({
      ...workExperience,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitWorkExperience = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('workexperience')
        .insert([
          {
            staff_number: workExperience.selectStaff,
            position_name: workExperience.positionName,
            start_date: workExperience.startDate,
            finish_date: workExperience.finishDate,
            organization: workExperience.organization
          }
        ]);

      if (error) {
        throw error;
      }
      console.log('Submitted Work Experience:', data);

      // Clear the form fields after successful submission
      setWorkExperience({
        selectStaff: '',
        positionName: '',
        startDate: '',
        finishDate: '',
        organization: ''
      });

      setSnackbarSeverity('success');
      setSnackbarMessage('Work experience added successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error inserting work experience:', error);

      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add work experience. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const [qualification, setQualification] = useState({
    selectStaff: '',
    type: '',
    institution: '',
    date: ''
  });

  const handleQualificationChange = (event) => {
    setQualification({
      ...qualification,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitQualification = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('qualifications')
        .insert([
          {
            staff_number: qualification.selectStaff,
            type_qual: qualification.type,
            institution_name: qualification.institution,
            date_of_qualification: qualification.date
          }
        ]);

      if (error) {
        throw error;
      }
      console.log('Submitted Qualification:', data);

      // Clear the form fields after successful submission
      setQualification({
        selectStaff: '',
        type: '',
        institution: '',
        date: ''
      });

      setSnackbarSeverity('success');
      setSnackbarMessage('Qualification added successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error inserting qualification:', error);

      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add qualification. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const [employmentContract, setEmploymentContract] = useState({
    selectStaff: '',
    hoursWorkedPerWeek: '',
    contractType: '',
    salaryPaymentType: ''
  });

  const handleEmploymentContractChange = (event) => {
    setEmploymentContract({
      ...employmentContract,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmitEmploymentContract = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('employment_contract')
        .insert([
          {
            staff_number: employmentContract.selectStaff,
            hours_worked_per_week: employmentContract.hoursWorkedPerWeek,
            contract_type: employmentContract.contractType,
            salary_payment_type: employmentContract.salaryPaymentType
          }
        ]);

      if (error) {
        throw error;
      }
      console.log('Submitted Employment Contract:', data);

      // Clear the form fields after successful submission
      setEmploymentContract({
        selectStaff: '',
        hoursWorkedPerWeek: '',
        contractType: '',
        salaryPaymentType: ''
      });

      setSnackbarSeverity('success');
      setSnackbarMessage('Employment contract added successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error inserting employment contract:', error);

      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add employment contract. Please try again later.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const validateForm = () => {
    // Add your form validation logic here
    return true; // Return true if the form is valid
  };

  const handleOpenPopup = () => {
    setStaffListPopupOpen(true);
  };

  const handleClosePopup = () => {
    setStaffListPopupOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
    <div>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3}>
          <div className="icon" style={{ display: 'flex' }}>
            <div style={{ margin: '8px' }}>
              <img src="../../img/staff.png" alt="Staff" />
            </div>
          </div>
        </Paper>

        <Box>
          <div>
            <ExpandableForm title="Staff Information" onSubmit={handleSubmitStaffInfo}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.firstName}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.lastName}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="address"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.address}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sex"
                    label="Sex"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.sex}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telephone"
                    label="Telephone"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.telephone}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nin"
                    label="NIN"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={staffInfo.nin}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    type="date"
                    value={staffInfo.dateOfBirth}
                    onChange={handleStaffInfoChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Position</InputLabel>
                    <Select
                      name="position"
                      value={staffInfo.position}
                      onChange={handleStaffInfoChange}
                      required
                    >
                      {positions.map((position) => (
                        <MenuItem key={position.position_id} value={position.position_id}>
                          {position.position_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Button variant="contained" color="primary" type="submit">
                        Add Staff
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

              </Grid>
            </ExpandableForm>
          </div>

          <div>
            <ExpandableForm title="Work Experience" onSubmit={handleSubmitWorkExperience}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Select Staff</InputLabel>
                    <Select
                      name="selectStaff"
                      value={workExperience.selectStaff}
                      onChange={handleWorkExperienceChange}
                      required
                    >
                      {staffMembers.map((staff) => (
                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                          {staff.first_name} {staff.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="positionName"
                    label="Position Name"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={workExperience.positionName}
                    onChange={handleWorkExperienceChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="startDate"
                    label="Start Date"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    type="date"
                    value={workExperience.startDate}
                    onChange={handleWorkExperienceChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="finishDate"
                    label="Finish Date"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    type="date"
                    value={workExperience.finishDate}
                    onChange={handleWorkExperienceChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="organization"
                    label="Organization"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={workExperience.organization}
                    onChange={handleWorkExperienceChange}
                  />
                </Grid>
                <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Button variant="contained" color="primary" type="submit">
                    Add Work Experience
                  </Button>
                  </Box>
                  </Grid>
                </Grid>
              </Grid>
            </ExpandableForm>
          </div>

          <div>
            <ExpandableForm title="Qualifications" onSubmit={handleSubmitQualification}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Select Staff</InputLabel>
                    <Select
                      name="selectStaff"
                      value={qualification.selectStaff}
                      onChange={handleQualificationChange}
                      required
                    >
                      {staffMembers.map((staff) => (
                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                          {staff.first_name} {staff.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="type"
                    label="Type"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={qualification.type}
                    onChange={handleQualificationChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="institution"
                    label="Institution"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={qualification.institution}
                    onChange={handleQualificationChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="date"
                    label="Date"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    type="date"
                    value={qualification.date}
                    onChange={handleQualificationChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Button variant="contained" color="primary" type="submit">
                    Add Qualications
                  </Button>
                  </Box>
                  </Grid>
                </Grid>
              </Grid>
            </ExpandableForm>
          </div>

          <div>
            <ExpandableForm title="Employment Contract" onSubmit={handleSubmitEmploymentContract}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Select Staff</InputLabel>
                    <Select
                      name="selectStaff"
                      value={employmentContract.selectStaff}
                      onChange={handleEmploymentContractChange}
                      required
                    >
                      {staffMembers.map((staff) => (
                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                          {staff.first_name} {staff.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="hoursWorkedPerWeek"
                    label="Hours Worked Per Week"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={employmentContract.hoursWorkedPerWeek}
                    onChange={handleEmploymentContractChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="contractType"
                    label="Contract Type"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={employmentContract.contractType}
                    onChange={handleEmploymentContractChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="salaryPaymentType"
                    label="Salary Payment Type"
                    variant="outlined"
                    fullWidth
                    required
                    size='small'
                    value={employmentContract.salaryPaymentType}
                    onChange={handleEmploymentContractChange}
                  />
                </Grid>
                <Grid container justify="center" alignItems="center" style={{ marginTop: '10px' }}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Button variant="contained" color="primary" type="submit">
                    Add Contract
                  </Button>
                  </Box>
                  </Grid>
                </Grid>
              </Grid>
            </ExpandableForm>
          </div>

          <Button style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={handleOpenPopup}>
            Open Staff List Popup
          </Button>

          <StaffListPopup open={staffListPopupOpen} onClose={handleClosePopup} />

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <SnackbarContent
              message={snackbarMessage}
              style={{
                backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
              }}
            />
          </Snackbar>
        </Box>
      </Box>
    </div>
    </ThemeProvider>
  );
};

export default Staff;