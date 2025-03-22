import { Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const getCafeColumns = (handleEmployeesClick ,handleEdit , handleDelete ) => [
    {
        key: "logo",
        dataIndex: "logo",
        title: "LOGO",
        width: "10%",
        render: (text) =>
            text ? (
                <img
                    src={`data:image/png;base64,${text}`}
                    alt="Cafe Logo"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 5 }}
                />
            ) : (
                "No Logo"
            ),
    },
    { key: "name", dataIndex: "name", title: "NAME", width: "10%" },
    { key: "description", dataIndex: "description", title: "DESCRIPTION", width: "20%" },
    {
        key: "employees",
        dataIndex: "employees",
        title: "NUMBER OF EMPLOYEE",
        width: "20%",
        render: (text, record) => (
            <Button type="link" onClick={() => handleEmployeesClick(record.name)}>
                {text || 0}
            </Button>
        ),
    },
    { key: "location", dataIndex: "location", title: "LOCATION", width: "20%" },
    {
        key: "actions", dataIndex: "actions", title: "ACTION", width: "10%", title: 'Actions',
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
    }, // Actions column
];
