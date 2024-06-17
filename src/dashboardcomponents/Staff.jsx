import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, TextField, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import ExpandableForm from './ExpandableForm';
import { supabase } from '../supabaseClient';

const Staff = () => {
  const [positions, setPositions] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

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
  
    } catch (error) {
      console.error('Error inserting staff info:', error.message);
      setErrorMessage('Failed to add staff. Please try again later.');
      setSuccessMessage('');
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
    } catch (error) {
      console.error('Error inserting work experience:', error);
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
    } catch (error) {
      console.error('Error inserting qualification:', error);
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
    } catch (error) {
      console.error('Error inserting employment contract:', error);
    }
  };

  // TODO: Define any additional state or functions needed
  return (
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
                    select
                    required
                    size='small'
                    value={staffInfo.sex}
                    onChange={handleStaffInfoChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="telephone"
                    label="Telephone"
                    type="tel"
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
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    size='small'
                    value={staffInfo.dateOfBirth}
                    onChange={handleStaffInfoChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" size='small'>
                    <InputLabel>Position</InputLabel>
                    <Select
                      name="position"
                      label="Position"
                      required
                      value={staffInfo.position}
                      onChange={handleStaffInfoChange}
                    >
                      {positions.map((position) => (
                        <MenuItem key={position.position_id} value={position.position_id}>
                          {position.position_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Button type="submit" variant="contained" color="primary"
                                  size='small'>
                                  Add Staff
                                </Button>
                              </Box>
                            </ExpandableForm>
                          </div>
                
                          <div>
                            <ExpandableForm title="Work Experience" onSubmit={handleSubmitWorkExperience}>
                              <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                  <FormControl fullWidth variant="outlined" size='small'>
                                    <InputLabel>Select Staff</InputLabel>
                                    <Select
                                      name="selectStaff"
                                      label="Select Staff"
                                      required
                                      value={workExperience.selectStaff}
                                      onChange={handleWorkExperienceChange}
                                    >
                                      {staffMembers.map((staff) => (
                                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                                          {`${staff.first_name} ${staff.last_name}`}
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
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size='small'
                                    InputLabelProps={{ shrink: true }}
                                    value={workExperience.startDate}
                                    onChange={handleWorkExperienceChange}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    name="finishDate"
                                    label="Finish Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size='small'
                                    InputLabelProps={{ shrink: true }}
                                    value={workExperience.finishDate}
                                    onChange={handleWorkExperienceChange}
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
                              </Grid>
                              <Box sx={{ mt: 1, textAlign: 'center' }}>
                                <Button type="submit" variant="contained" color="primary" size='small'>
                                  Add Work Experience
                                </Button>
                              </Box>
                            </ExpandableForm>
                          </div>
                
                          <div>
                            <ExpandableForm title="Qualifications" onSubmit={handleSubmitQualification}>
                              <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                  <FormControl fullWidth variant="outlined" size='small'>
                                    <InputLabel>Select Staff</InputLabel>
                                    <Select
                                      name="selectStaff"
                                      label="Select Staff"
                                      required
                                      value={qualification.selectStaff}
                                      onChange={handleQualificationChange}
                                    >
                                      {staffMembers.map((staff) => (
                                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                                          {`${staff.first_name} ${staff.last_name}`}
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
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size='small'
                                    InputLabelProps={{ shrink: true }}
                                    value={qualification.date}
                                    onChange={handleQualificationChange}
                                  />
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 1, textAlign: 'center' }}>
                                <Button type="submit" variant="contained" color="primary" size='small'>
                                  Add Qualification
                                </Button>
                              </Box>
                            </ExpandableForm>
                          </div>
                
                          <div>
                            <ExpandableForm title="Employment Contract" onSubmit={handleSubmitEmploymentContract}>
                              <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                  <FormControl fullWidth variant="outlined" size='small'>
                                    <InputLabel>Select Staff</InputLabel>
                                    <Select
                                      name="selectStaff"
                                      label="Select Staff"
                                      required
                                      value={employmentContract.selectStaff}
                                      onChange={handleEmploymentContractChange}
                                    >
                                      {staffMembers.map((staff) => (
                                        <MenuItem key={staff.staff_number} value={staff.staff_number}>
                                          {`${staff.first_name} ${staff.last_name}`}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    name="hoursWorkedPerWeek"
                                    label="Hours Worked Per Week"
                                    type="number"
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
                                    select
                                    required
                                    size='small'
                                    value={employmentContract.contractType}
                                    onChange={handleEmploymentContractChange}
                                  >
                                    <MenuItem value="Temporary">Temporary</MenuItem>
                                    <MenuItem value="Permanent">Permanent</MenuItem>
                                  </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    name="salaryPaymentType"
                                    label="Salary Payment Type"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    required
                                    size='small'
                                    value={employmentContract.salaryPaymentType}
                                    onChange={handleEmploymentContractChange}
                                  >
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                  </TextField>
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 1, textAlign: 'center' }}>
                                <Button type="submit" variant="contained" color="primary" size='small'>
                                  Add Employment Contract
                                </Button>
                              </Box>
                            </ExpandableForm>
                          </div>
                        </Box>
                      </Box>
                    </div>
                  );
                };
                
                export default Staff;
                
