import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Input, Form, } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function Category() {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        axios.get('/categories').then((res) => {
            // console.log(res.data);
            setDataSource(res.data);
        });
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            editable: true,
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} />

        },
    ];

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const handleSave = (row) => {
        // console.log(row);
        setDataSource(dataSource.map(item => {
            if (item.id === row.id) {
                return {
                    id: item.id,
                    title: row.title,
                    value: row.title,
                }
            }
            return item;
        }));
        axios.patch(`/categories/${row.id}`, {
            title: row.title,
            value: row.title,
        })
    }

    const showConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                setDataSource(dataSource.filter(data => data.id !== item.id));
                axios.delete(`/categories/${item.id}`);
            },
        });
    }; //!删除按钮的确认框(是个函数形式)

    return (
        <div>
            <Table components={components} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}

