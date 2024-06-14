import React from 'react';
import { Paper } from '@mui/material';

const Prescription = () => {
  return (
    <div>
      <Paper elevation={3}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/prescription.jpg" alt="Prescription" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>Prescription</h2>
        </div>
        
      </div>
      </Paper>
      {/* Patient content goes here */}
    </div>
  );
};

export default Prescription;
