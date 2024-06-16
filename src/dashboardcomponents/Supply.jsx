import React from 'react';
import { Box, Paper, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem } from '@mui/material';
import ExpandableForm from './ExpandableForm';

const Supply = () => {
  return (
    <div>
      <Paper elevation={6}>
      <div className="icon" style={{display:'flex'}}>
        <div style={{margin:'8px'}}>
          <img src="../../img/supply.png" alt="Staff" />
        </div>
        <div>
          <h2 style={{marginLeft:'10px'}}>Requisition</h2>
        </div>
      </div>
      </Paper>
        <Box>
          <div>
          <ExpandableForm title="Create Requisition">
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField label="Item" variant="outlined" fullWidth select required size='small'>
                  <MenuItem value="item1">Paracetamol</MenuItem>
                  <MenuItem value="item2">Tuseran</MenuItem>
                  <MenuItem value="item3">Sleeping Pills</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField label="Ward number" variant="outlined" fullWidth select required size='small'>
                  <MenuItem value="ward1">Number 1</MenuItem>
                  <MenuItem value="ward2">Number 2</MenuItem>
                  <MenuItem value="ward3">Number 3</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField label="Quantity" type="number" variant="outlined" fullWidth required size='small'/>
              </Grid>
            </Grid>
            <Box sx={{ mt: 1, textAlign: 'center'}}>
              <Button type="submit" variant="contained" color="secondary" size='small' style={{background:'#0012bff'}}>
                Submit
              </Button>
            </Box>

          </ExpandableForm>
          </div>
          <div>
            <ExpandableForm title="Accept Requisition">
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Suppy Name</TableCell>
                      <TableCell>Suply type</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Empty table body */}
                  </TableBody>
                </Table>
              </TableContainer>
            </ExpandableForm>
          </div>
        </Box>
      {/* Patient content goes here */}
    </div>
  );
};

export default Supply;