import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Input, Button, Spin, Alert, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteCafe, getCafeList } from '../../services/cafeService';

const CafeList = () => {
  const [location, setLocation] = useState('');
  const [data, setData] = useState([]);

  const navigate = useNavigate(); // React Router Navigation Hook
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch data from API
  const fetchData = async (locationQuery = '') => {

    setLoading(true);
    setError('');

    try {

      const response = await getCafeList(locationQuery);
      if (response.status != 200) {
        throw new Error('Error fetching data');
      }
      const result = response.data;
      const dataWithKey = result.map((item) => ({ key: item.cafe_id, ...item }));
      setData(dataWithKey);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchData();
  }, []);

  // Handle Delete Operation
  const handleDelete = async (cafe_id) => {
    try {

      const response = await deleteCafe(cafe_id)
      if (response.status != 200) {
        throw new Error('Failed to delete café');
      }
      messageApi.success('Café deleted successfully');
      setData(data.filter((item) => item.cafe_id !== cafe_id)); // Remove deleted item from UI
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  // Handle Edit Operation (Placeholder for now)
  const handleEdit = (cafe) => {
    navigate('/cafe', { state: { cafe } }); // ✅ Pass cafe data to Edit Page
  };

  // Navigate to Employee Page with Cafe Filter
  const handleEmployeesClick = (cafeName) => {
    navigate(`/employees?cafe=${encodeURIComponent(cafeName)}`);
  };

  const handleAddCafe = () => {
    navigate(`/cafe`);
  };

  // Define table columns
  const columns = useMemo(() => [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (text) =>
        text ? (
          <img
            src={`data:image/png;base64,${text}`}
            alt="Cafe Logo"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 5 }}
          />
        ) : (
          'No Logo'
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      render: (text, record) => (
        <Button type="link" onClick={() => handleEmployeesClick(record.name)}>
          {text || 0}
        </Button>
      ), // Employees column is now a clickable button!
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.cafe_id)}>
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [data]);




  return (
    <div style={{ padding: '20px' }}>
      {contextHolder}
      <h1>List of Cafes</h1>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: 200, marginRight: '10px' }}
        />
        <Button type="primary" onClick={() => fetchData(location)} disabled={loading}>
          Fetch Data
        </Button>

        <Button type="primary" onClick={() => handleAddCafe()} disabled={loading}>
          Add New Cafe
        </Button>
      </div>

      {loading && <Spin tip="Loading..." style={{ marginBottom: '20px' }} />}
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}

      <Table dataSource={data} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default CafeList;
