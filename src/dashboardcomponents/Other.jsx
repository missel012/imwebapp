import React from 'react';
import { Paper } from '@mui/material';

const Other = () => {
  return (
    <div>
      <Paper elevation={3}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/other.png" alt="Other" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>Other</h2>
        </div>
        
      </div>
      </Paper>
      {/* Patient content goes here */}
    </div>
  );
};

export default Other;
