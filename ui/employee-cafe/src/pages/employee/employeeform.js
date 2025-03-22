import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Select, Radio, message, Flex, Row } from "antd";
import TextBox from "../../component/textbox"; // ✅ Reusable TextBox Component
import { getCafeList } from "../../services/cafeService";
import { saveEmployee } from "../../services/employeeService";

const { Option } = Select;

const EmployeeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.employee;
  const [cafes, setCafes] = useState([]); 

  const [messageApi, contextHolder] = message.useMessage();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    cafeId: "", // 
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    getCafeList().then((res) => res.data)
      .then((data) => {
        setCafes(data);

        // ✅ If Editing, Pre-Fill `cafeId`
        if (isEditMode) {
          const cafe = data.find((c) => c.name === isEditMode.cafe);
          if (cafe) {
            setFormValues((prev) => ({
              ...prev,
              cafeId: cafe.cafe_id, // ✅ Set the correct cafe_id
            }));
          }
        }
      })
      .catch(() => message.error("Failed to load cafés"));
  }, [isEditMode]);


  useEffect(() => {
    if (isEditMode) {
      setFormValues({
        name: isEditMode.name,
        email: isEditMode.email_address,
        phone: isEditMode.phone_number,
        gender: isEditMode.gender,
        cafeId: isEditMode.cafeId,
      });
    }
  }, [isEditMode]);

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleCafeChange = (cafe_id) => {
    const cafe = cafes.find((c) => c.cafe_id === cafe_id);

    setIsDirty(true);
    if (cafe) {
      setFormValues((prev) => ({ ...prev, cafeId: cafe.cafe_id }));
    }
  };

  // ✅ Validate Phone Number (SG format)
  const isValidSGPhone = (phone) => /^[89]\d{7}$/.test(phone);

  // ✅ Handle Form Submission
  const handleSubmit = async () => {
    if (!isDirty) {
      navigate("/employees");
    }

    if (formValues.name.length < 6 || formValues.name.length > 10) {
      messageApi.error("Name must be between 6 and 10 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      messageApi.error("Invalid email address.");
      return;
    }

    if (!isValidSGPhone(formValues.phone)) {
      messageApi.error("Phone number must start with 8 or 9 and have 8 digits.");
      return;
    }

    if (!formValues.cafeId) {
      messageApi.error("Please select an assigned café.");
      return;
    }

    const newEmployee = {
      name: formValues.name,
      email_address: formValues.email,
      phone_number: formValues.phone,
      gender: formValues.gender,
      cafe: formValues.cafeId
    };

    try {
      const response = await saveEmployee(isEditMode, newEmployee);
      if (!response.status === 200) {
        throw new Error(`Failed to save employee: ${response.statusText}`);
      }
      messageApi.success(`Employee ${isEditMode ? "updated" : "created"} successfully!`);
      navigate("/employees");
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    navigate("/employees");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>{isEditMode ? "Edit" : "Add"} Employee</h2>
      {contextHolder}
      <Form layout="vertical">
        <TextBox
          label="Name"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
          minLength={6}
          maxLength={10}
          required
        />
        <TextBox
          label="Email Address"
          value={formValues.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <TextBox
          label="Phone Number"
          value={formValues.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="8xxxxxxx or 9xxxxxxx"
        />

        <Row> <label style={{ fontWeight: "bold" }}>Gender</label> </Row>
        <Row style={{ marginBottom: "15px" }}>
          <Radio.Group
            onChange={(e) => handleChange("gender", e.target.value)}
            value={formValues.gender}
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Row>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Assigned Café</label>
          <Select
            value={formValues.cafeId} 
            onChange={handleCafeChange}
            placeholder="Select a café"
            style={{ width: "100%" }}
          >
            {cafes.map((cafe) => (
              <Option key={cafe.cafe_id} value={cafe.cafe_id}> 
                {cafe.name}
              </Option>
            ))}
          </Select>
        </div>

        <Flex gap="large" justify="center" >
          <Button type="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {isEditMode ? "Update" : "Submit"}
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default EmployeeForm;
