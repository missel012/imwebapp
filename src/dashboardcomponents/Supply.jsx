import React from 'react';
import { Paper } from '@mui/material';

const Supply = () => {
  return (
    <div>
      <Paper elevation={3}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/supply.png" alt="Supply" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>Supply</h2>
        </div>
        
      </div>
      </Paper>
      {/* Patient content goes here */}
    </div>
  );
};

export default Supply;
