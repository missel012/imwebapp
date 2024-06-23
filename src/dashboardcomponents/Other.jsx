import React, { useEffect, useState } from 'react';
import { Box, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';
import ExpandableForm from './ExpandableForm';
import { supabase } from '../supabaseClient';

const Other = () => {
  const [localDoctorInfo, setLocalDoctorInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalDoctorInfo = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('localdoctor') // Correct table name
        .select('doctor_id, doctor_name, address, telephone, clinic_number');

      if (error) {
        console.error('Error fetching data: ', error);
        setError(error);
      } else {
        console.log('Fetched data:', data);
        setLocalDoctorInfo(data);
      }
      setLoading(false);
    };

    fetchLocalDoctorInfo();
  }, []);

  return (
    <div>
      <Paper elevation={3}>
        <div className="icon" style={{ display: 'flex' }}>
          <div style={{ margin: '8px' }}>
            <img src="../../img/other.png" alt="Other section icon" />
          </div>
          <div>
            <h2 style={{ marginLeft: '10px' }}>Other</h2>
          </div>
        </div>
      </Paper>
      <Box>
        <ExpandableForm title="Local Doctor Information">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {loading && <CircularProgress />}
              {error && <Typography color="error">Failed to load data: {error.message}</Typography>}
              {!loading && !error && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Clinic Number</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Telephone Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localDoctorInfo.map((doctor) => (
                        <TableRow key={doctor.doctor_id}>
                          <TableCell>{doctor.clinic_number}</TableCell>
                          <TableCell>{doctor.doctor_name}</TableCell>
                          <TableCell>{doctor.address}</TableCell>
                          <TableCell>{doctor.telephone}</TableCell>
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
          <Grid container spacing={1}>
           <p>Wellmeadows Hospital, situated in the heart of Edinburgh, UK, is a premier healthcare facility renowned for its exceptional patient care and state-of-the-art medical services. Our dedicated team of skilled professionals employs the latest medical technologies and innovative treatments across various specialties, including cardiology, oncology, orthopedics, and pediatrics. Committed to personalized and compassionate care, Wellmeadows Hospital provides a supportive and healing environment for all patients. Conveniently located, we strive to stay at the forefront of medical advancements, ensuring the highest standards of health and well-being for the Edinburgh community.</p>
          </Grid>
        </ExpandableForm>
      </Box>
    </div>
  );
};

export default Other;