import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Upload, message, Image, Flex, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextBox from '../../component/textbox';
import { saveCafe } from '../../services/cafeService';

const CafeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.cafe;
  const [messageApi, contextHolder] = message.useMessage();

  //Track uploaded file and image preview
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // ✅ For displaying image preview
  const [isDirty, setIsDirty] = useState(false); // ✅ Track unsaved changes

  //Form State
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    logo: null, // Stores Base64-encoded image
    location: '',
  }
  );

  //Load existing data if editing
  useEffect(() => {
    if (isEditMode) {
      setFormValues({
        name: isEditMode.name,
        description: isEditMode.description,
        logo: isEditMode.logo, // Prefill existing logo
        location: isEditMode.location,
      });

      // Set existing image preview if available
      if (isEditMode.logo) {
        setImagePreview(`data:image/png;base64,${isEditMode.logo}`);
      }
    }
  }, [isEditMode]);

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new Error("Provided file is not a Blob or File"));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };


  // Handle File Upload (Show Image Preview)
  const handleFileChange = async ({ fileList }) => {
    if (fileList.length === 0) return;

    const file = fileList[0].originFileObj;

    if (file.size > 2 * 1024 * 1024) {
      messageApi.error("File must be smaller than 2MB!");
      return;
    }

    try {
      const base64String = await convertToBase64(file);

      //  Update form state & preview
      setFormValues((prev) => ({ ...prev, logo: base64String }));
      setImagePreview(URL.createObjectURL(file)); // ✅ Show selected image preview
      setFileList(fileList);

      messageApi.success("File uploaded successfully");
    } catch (error) {
      messageApi.error("Error converting file to Base64");
    }
  };


  // Handle Form Submission
  const handleSubmit = async () => {
    if (!isDirty) {
      navigate("/");
    }

    if (formValues.name.length < 6 || formValues.name.length > 10) {
      messageApi.error("Name must be between 6 and 10 characters.");
      return;
    }

    if (formValues.description.length > 256) {
      messageApi.error("Description must be less than 256 characters.");
      return;
    }

    const newCafe = {
      name: formValues.name,
      description: formValues.description,
      location: formValues.location,
      logo: formValues.logo,
    };


    try {
      await saveCafe(isEditMode, newCafe);
      messageApi.success(`Café ${isEditMode ? "updated" : "created"} successfully!`);
      navigate("/");
    } catch (error) {

      messageApi.error(error.message);
    }
  };

  //  Handle Cancel Button
  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '80%', margin: 'auto', padding: '20px' }}>

      {contextHolder}

      <h2>{isEditMode ? 'Edit' : 'Add'} Café</h2>



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
          label="Description"
          value={formValues.description}
          onChange={(e) => handleChange("description", e.target.value)}
          maxLength={256}
          required
        />
        <TextBox
          label="Location"
          value={formValues.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />

        <div style={{ marginBottom: '15px' }}>
          <Row>
            <label style={{ fontWeight: 'bold' }}>Logo (Max: 2MB)</label>
          </Row>

          <Row>
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={{ showPreviewIcon: false }}
              fileList={undefined}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Row>

          {imagePreview && (
            <div>
              <Row justify="">
                <div style={{ marginTop: 10 }}>
                  <label style={{ fontWeight: 'bold' }}>Preview:</label>
                </div>
              </Row>
              <Row justify="center">
                <Image
                  src={imagePreview}
                  alt="Cafe Logo Preview"
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 5 }}
                />

              </Row>
            </div>
          )}
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

export default CafeForm;
