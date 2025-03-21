import React from 'react';
import { Spin, Table } from 'antd';
import Alert from 'antd/es/alert/Alert';

const TableList = ({ header, data, columns, pageSize , loading, error
 }) => {
 
  return (
    
    <div>
        <h1>{header}</h1>
        <Table dataSource={data} columns={columns} pagination={{ pageSize: pageSize }} />
    </div>
  );
};

export default TableList;
