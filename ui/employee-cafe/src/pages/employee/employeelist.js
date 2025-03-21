import React, { useState, useEffect } from "react";
import { Table, Button, Spin, Alert, Space, Popconfirm, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { deleteEmployee, getEmployeeList } from "../../services/employeeService";

const EmployeeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract cafe query parameter (if provided)
  const queryParams = new URLSearchParams(location.search);
  const cafeFilter = queryParams.get("cafe") || "";

  // ✅ Hide Edit & Delete buttons if `cafeFilter` (cafe name) exists
  const hideActions = !!cafeFilter;

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getEmployeeList(encodeURIComponent(cafeFilter));

      if (response.status != 200) {
        throw new Error("Error fetching data");
      }

      const result = await response.data;
     
      const dataWithKey = result.map((item) => ({ key: item.employee_id, ...item }));
      setData(dataWithKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch Employees
  useEffect(() => {
    fetchData();
  }, [cafeFilter]);

  // Handle Delete Operation
  const handleDelete = async (employee_id) => {
    try {
      const response = await deleteEmployee(employee_id);
      if (response.status != 200) {
        throw new Error("Failed to delete employee");
      }

      messageApi.success("Employee deleted successfully");
      setData(data.filter((item) => item.employee_id !== employee_id));
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  // Handle Edit Operation
  const handleEdit = (employee) => {
    console.log(employee);
    navigate("/employee", { state: { employee } });
  };

  // Navigate to Add Employee Page
  const handleAddEmployee = () => {
    navigate("/employee");
  };

  // Navigate back to Cafes List
  const handleBackToCafes = () => {
    navigate("/");
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email Address",
      dataIndex: "email_address",
      key: "email_address",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Days Worked",
      dataIndex: "days_worked",
      key: "days_worked",
    },
    {
      title: "Café Name",
      dataIndex: "cafe",
      key: "cafe",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        !hideActions && ( // ✅ Hide Edit/Delete if `cafeFilter` exists
          <Space size="middle">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.employee_id)}>
              <Button type="danger" icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (

    <div style={{ padding: "20px" }}>
      
      {contextHolder}
      {loading && <Spin tip="Loading..." />}
      {error && <Alert message={error} type="error" showIcon />}

      <h1>Employees {cafeFilter ? `for ${cafeFilter}` : ""}</h1>

      {/* ✅ Always Show "Back to Cafes" Button */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {hideActions && (<Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBackToCafes}>
          Back to Cafes
        </Button>
        )}
        {/* ✅ Hide "Add New Employee" button if `cafeFilter` exists */}
        {!hideActions && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEmployee}>
            Add New Employee
          </Button>
        )}
      </div>



      <Table dataSource={data} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default EmployeeList;
