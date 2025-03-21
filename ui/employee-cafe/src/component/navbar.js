import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";


const menus = [
    { key: 'cafe', label: 'Cafe', path: "/" },
    { key: 'employee', label: 'Employee', path: "/employees" }
]

const Navbar = () => {

    const location = useLocation(); // Get the current path
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    // Update selected menu when route changes
    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            style={{ display: "flex", justifyContent: "center", width: "100%", margin: "0 auto" }}
        >
            {menus.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.path}>{item.label}</Link>
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default Navbar;
