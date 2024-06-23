import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box, Button, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ExpandableForm from './ExpandableForm'; // Assuming you have this component
import { supabase } from '../supabaseClient'; // Your Supabase client setup

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Supply = () => {
  const [staffList, setStaffList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [wardRequisitionList, setWardRequisitionList] = useState([]);
  const [requisitionSupplyList, setRequisitionSupplyList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);

  const [formData, setFormData] = useState({
    staff_number: '',
    item_id: '',
    ward_number: '',
    quantity_ordered: 0,
    date_ordered: '',
    supplier_number: '',
  });

  const [newSupplyData, setNewSupplyData] = useState({
    supply_name: '',
    supply_description: '',
    quantity_in_stock: 0,
    reorder_level: 0,
    cost_per_unit: 0,
    supplier_number: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isTableVisible, setIsTableVisible] = useState(false);

  useEffect(() => {
    fetchStaff();
    fetchItems();
    fetchWards();
    fetchWardRequisitions();
    fetchRequisitionSupplies();
    fetchSuppliers();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) throw error;
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error.message);
      showSnackbar('Failed to fetch staff', 'error');
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('supply').select('*');
      if (error) throw error;
      setItemList(data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
      showSnackbar('Failed to fetch items', 'error');
    }
  };

  const fetchWards = async () => {
    try {
      const { data, error } = await supabase.from('ward').select('*');
      if (error) throw error;
      setWardList(data);
    } catch (error) {
      console.error('Error fetching wards:', error.message);
      showSnackbar('Failed to fetch wards', 'error');
    }
  };

  const fetchWardRequisitions = async () => {
    try {
      const { data, error } = await supabase.from('ward_requisition').select('*');
      if (error) throw error;
      setWardRequisitionList(data);
    } catch (error) {
      console.error('Error fetching ward requisitions:', error.message);
      showSnackbar('Failed to fetch ward requisitions', 'error');
    }
  };

  const fetchRequisitionSupplies = async () => {
    try {
      const { data, error } = await supabase.from('requisition_supply').select('*');
      if (error) throw error;
      setRequisitionSupplyList(data);
    } catch (error) {
      console.error('Error fetching requisition supplies:', error.message);
      showSnackbar('Failed to fetch requisition supplies', 'error');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase.from('suppliers').select('*');
      if (error) throw error;
      setSuppliersList(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
      showSnackbar('Failed to fetch suppliers', 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewSupplyInputChange = (event) => {
    const { name, value } = event.target;
    setNewSupplyData({ ...newSupplyData, [name]: value });
  };

  const handleSubmitRequisition = async () => {
    try {
      if (!formData.staff_number || !formData.item_id || !formData.ward_number || formData.quantity_ordered <= 0 || !formData.date_ordered) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const req_number = await generateReqNumber();
      if (!req_number) {
        showSnackbar('Failed to generate requisition number', 'error');
        return;
      }

      const { data: wardRequisitionData, error: requisitionError } = await supabase.from('ward_requisition').insert([
        {
          req_number,
          staff_number: formData.staff_number,
          ward_number: formData.ward_number,
          date_ordered: formData.date_ordered,
        },
      ]);

      if (requisitionError) {
        throw requisitionError;
      }

      const { data: requisitionSupplyData, error: supplyError } = await supabase.from('requisition_supply').insert([
        {
          req_number,
          supply_id: formData.item_id,
          quantity_ordered: formData.quantity_ordered,
        },
      ]);

      if (supplyError) {
        throw supplyError;
      }

      console.log('Requisition submitted successfully:', wardRequisitionData, requisitionSupplyData);
      showSnackbar('Requisition submitted successfully', 'success');

      setFormData({
        staff_number: '',
        item_id: '',
        ward_number: '',
        quantity_ordered: 0,
        date_ordered: '',
      });

      fetchWardRequisitions();
      fetchRequisitionSupplies();
    } catch (error) {
      console.error('Error submitting requisition:', error.message);
      showSnackbar('Failed to submit requisition', 'error');
    }
  };
  const handleSubmitNewSupply = async () => {
    try {
      // Validate required fields
      if (!newSupplyData.supply_name || !newSupplyData.supply_description || 
          newSupplyData.quantity_in_stock <= 0 || newSupplyData.reorder_level <= 0 || 
          newSupplyData.cost_per_unit <= 0 || !newSupplyData.supplier_number) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }
  
      // Perform insertion
      const { data, error } = await supabase.from('supply').insert([{
        supply_name: newSupplyData.supply_name,
        supply_description: newSupplyData.supply_description,
        quantity_in_stock: newSupplyData.quantity_in_stock,
        reorder_level: newSupplyData.reorder_level,
        cost_per_unit: newSupplyData.cost_per_unit,
        supplier_number: newSupplyData.supplier_number,
      }]);
  
      if (error) {
        throw error;
      }
  
      console.log('Supply added successfully:', data);
      showSnackbar('Supply added successfully', 'success');
  
      // Clear form data after successful insertion
      setNewSupplyData({
        supply_name: '',
        supply_description: '',
        quantity_in_stock: 0,
        reorder_level: 0,
        cost_per_unit: 0,
        supplier_number: '',
      });
  
      // Refresh item list (if needed)
      fetchItems();
    } catch (error) {
      console.error('Error adding supply:', error.message);
      showSnackbar('Failed to add Supply', 'error');
    }
  };
  

  const generateSupplyId = () => {
    return `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const generateReqNumber = async () => {
    try {
      const { count, error } = await supabase.from('ward_requisition').select('*', { count: 'exact' });

      if (error) throw error;

      const req_number = (count || 0) + 1;
      return req_number;
    } catch (error) {
      console.error('Error generating req_number:', error.message);
      showSnackbar('Failed to generate requisition number', 'error');
      return null;
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div>
      <Paper elevation={6}>
        <div className="icon" style={{ display: 'flex' }}>
          <div style={{ margin: '8px' }}>
            <img src="../../img/supply.png" alt="Supply" />
          </div>
          <div>
            <h2 style={{ marginLeft: '10px' }}>Requisition</h2>
          </div>
        </div>
      </Paper>
      <Box>
        <div>
          <ExpandableForm title="Add Supply">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="supply_name"
                  label="Supply Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newSupplyData.supply_name}
                  onChange={handleNewSupplyInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="supply_description"
                  label="Supply Description"
                  variant="outlined"
                  fullWidth
                  select
                  size="small"
                  value={newSupplyData.supply_description}
                  onChange={handleNewSupplyInputChange}
                >
                  <MenuItem value="Surgical">Surgical Supply</MenuItem>
                  <MenuItem value="Non-Surgical">Non-Surgical Supply</MenuItem>
                  <MenuItem value="Pharmaceutical">Pharmaceutical Supply</MenuItem>
                </TextField>
              </Grid>
              {newSupplyData.supply_description === 'Pharmaceutical' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dosage"
                      label="Dosage"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={newSupplyData.dosage}
                      onChange={handleNewSupplyInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="method_of_administration"
                      label="Method of Administration"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={newSupplyData.method_of_administration}
                      onChange={handleNewSupplyInputChange}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="quantity_in_stock"
                  label="Quantity in Stock"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newSupplyData.quantity_in_stock}
                  onChange={handleNewSupplyInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="reorder_level"
                  label="Reorder Level"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newSupplyData.reorder_level}
                  onChange={handleNewSupplyInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="cost_per_unit"
                  label="Cost Per Unit"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newSupplyData.cost_per_unit}
                  onChange={handleNewSupplyInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="supplier_number"
                  label="Supplier Number"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newSupplyData.supplier_number}
                  onChange={handleNewSupplyInputChange}
                  select
                >
                  {suppliersList.map((supplier) => (
                    <MenuItem key={supplier.supplier_number} value={supplier.supplier_number}>
                      {supplier.supplier_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button variant="contained" color="primary" onClick={handleSubmitNewSupply}>
                    Add Supply
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ExpandableForm>
          <ExpandableForm title="Create Requisition">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="staff_number"
                  label="Staff"
                  variant="outlined"
                  fullWidth
                  select
                  required
                  size="small"
                  value={formData.staff_number}
                  onChange={handleInputChange}
                >
                  {staffList.map((staff) => (
                    <MenuItem key={staff.staff_number} value={staff.staff_number}>
                      {`${staff.first_name} ${staff.last_name}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="item_id"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  select
                  required
                  size="small"
                  value={formData.item_id}
                  onChange={handleInputChange}
                >
                  {itemList.map((item) => (
                    <MenuItem key={item.supply_id} value={item.supply_id}>
                      {item.supply_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="ward_number"
                  label="Ward"
                  variant="outlined"
                  fullWidth
                  select
                  required
                  size="small"
                  value={formData.ward_number}
                  onChange={handleInputChange}
                >
                  {wardList.map((ward) => (
                    <MenuItem key={ward.ward_number} value={ward.ward_number}>
                      {`${ward.ward_name}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  name="quantity_ordered"
                  label="Quantity Ordered"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  value={formData.quantity_ordered}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="date_ordered"
                  label="Date Ordered"
                  type="date"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  value={formData.date_ordered}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Button variant="contained" color="primary" onClick={handleSubmitRequisition}>
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ExpandableForm>
          <Box display="flex" justifyContent="center" style={{ marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={toggleTableVisibility}>
              {isTableVisible ? 'Hide Requisition Table' : 'Show Requisition Table'}
            </Button>
          </Box>

          {isTableVisible && (
            <TableContainer component={Paper} style={{ maxHeight: '300px', marginTop: '20px' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Requisition Number</TableCell>
                    <TableCell>Staff Number</TableCell>
                    <TableCell>Ward Number</TableCell>
                    <TableCell>Date Ordered</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity Ordered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wardRequisitionList.map((wardRequisition) => {
                    const requisitionSupplies = requisitionSupplyList.filter(
                      (supply) => supply.req_number === wardRequisition.req_number
                    );
                    return requisitionSupplies.map((requisitionSupply, index) => (
                      <TableRow key={`${wardRequisition.req_number}-${index}`}>
                        <TableCell>{wardRequisition.req_number}</TableCell>
                        <TableCell>{wardRequisition.staff_number}</TableCell>
                        <TableCell>{wardRequisition.ward_number}</TableCell>
                        <TableCell>{wardRequisition.date_ordered}</TableCell>
                        <TableCell>{requisitionSupply.supply_id}</TableCell>
                        <TableCell>{requisitionSupply.quantity_ordered}</TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Supply;
