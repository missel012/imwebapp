import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, styled } from '@mui/material';
import { supabase } from '../supabaseClient';

const ColoredPaper = styled(Paper)({
  backgroundColor: '#f0f0f0', 
  padding: '10px',
  borderBottomRightRadius: '50px', 
  borderTopLeftRadius: '50px',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: '20px', 
  boxShadow: '0 4px 8px rgba(128, 128, 128, 0.5)', 
});

const CenteredHeader = styled(Typography)({
  color: '#023c77', 
  textAlign: 'center',
  marginTop: '20px', 
  marginBottom: '20px', 
});

const WelcomeDashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalInpatients, setTotalInpatients] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalLocalDoctors, setTotalLocalDoctors] = useState(0);
  const [totalWards, setTotalWards] = useState(0);
  const [totalOutPatients, setTotalOutPatients] = useState(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const { data: patients } = await supabase.from('patient').select('patient_number');
        setTotalPatients(patients.length);

        const { data: inPatients } = await supabase.from('in_patient').select('inpatient_id');
        setTotalInpatients(inPatients.length);

        const { data: outPatients } = await supabase.from('out_patient').select('patient_number');
        setTotalOutPatients(outPatients.length);

        const { data: staff } = await supabase.from('staff').select('staff_number');
        setTotalStaff(staff.length);

        const { data: wards } = await supabase.from('ward').select('ward_number');
        setTotalWards(wards.length);

        const { data: localDoctors } = await supabase.from('localdoctor').select('doctor_id');
        setTotalLocalDoctors(localDoctors.length);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <Container>
      <CenteredHeader variant="h4" gutterBottom>
        Wellmeadows Board
      </CenteredHeader>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total Patients
            </Typography>
            <Typography variant="h4">{totalPatients}</Typography>
          </ColoredPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total In-Patients
            </Typography>
            <Typography variant="h4">{totalInpatients}</Typography>
          </ColoredPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total Out-Patients
            </Typography>
            <Typography variant="h4">{totalOutPatients}</Typography>
          </ColoredPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total Staff
            </Typography>
            <Typography variant="h4">{totalStaff}</Typography>
          </ColoredPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total Local Doctors
            </Typography>
            <Typography variant="h4">{totalLocalDoctors}</Typography>
          </ColoredPaper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ColoredPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Total Wards
            </Typography>
            <Typography variant="h4">{totalWards}</Typography>
          </ColoredPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WelcomeDashboard;
