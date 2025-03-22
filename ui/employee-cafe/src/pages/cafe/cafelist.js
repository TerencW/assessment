import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Spin, Alert, Space, Popconfirm, message, Flex } from 'antd';

import { useNavigate } from 'react-router-dom';
import TableList from '../../component/listingTable';

import { useSelector, useDispatch } from "react-redux";
import { removeCafe , fetchCafes } from '../../services/cafeSlice';
import {  getCafeColumns } from '../../constants/tableColumns';

const CafeList = () => {
  
  const [location, setLocation] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [messageApi, contextHolder] = message.useMessage();
  const { cafes, loading, error } = useSelector((state) => state.cafes);

  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch , location]);

  const handleSearch = () => {
    dispatch(fetchCafes(location));
  };

  const handleDelete = async (cafe_id) => {
    dispatch(removeCafe(cafe_id))
    .then(() => messageApi.success("Cafe deleted successfully!"))
    .catch((error) => messageApi.error(`Delete failed: ${error.message}`));
  };

  const handleEdit = (cafe) => {
    navigate('/cafe', { state: { cafe } }); 
  };

  // Navigate to Employee Page with Cafe Filter
  const handleEmployeesClick = (cafeName) => {
    navigate(`/employees?cafe=${encodeURIComponent(cafeName)}`);
  };

  const handleAddCafe = () => {
    navigate(`/cafe`);
  };


  const handleRefresh = () => {
    setLocation('')
    dispatch(fetchCafes(location));
  };



  return (
    <div style={{ padding: '10px' }}>

      {contextHolder}
      {loading && <Spin tip="Loading..." style={{ marginBottom: '20px' }} />}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
          
      <h1>CAFE</h1>

      <Flex  style={{ padding: '10px' }} align="start" gap="middle" horizontal>
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: 200, marginRight: '10px' }}
        />

        <Button type="primary" onClick={handleSearch} disabled={loading}>
          Search
        </Button>

        <Button type="primary" onClick={() => handleAddCafe()} disabled={loading}>
          Add New Cafe
        </Button>

        <Button color="cyan" onClick={handleRefresh}>
            Refresh
      </Button>
      </Flex>


      {/* header, data, columns, pageSize */}
      <TableList 
        header="List of Cafes"
        loading={loading} 
        error={error}
        data={cafes}
        columns={getCafeColumns(handleEmployeesClick ,handleEdit, handleDelete)}
        pageSize={10} 
      />
     
    </div>
  );
};

export default CafeList;
