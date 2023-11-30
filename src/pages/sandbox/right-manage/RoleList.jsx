import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd';
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]); //!Table组件数据
    const [treeData, setTreeData] = useState([]); //!树形结构数据

    const [isModalOpen, setIsModalOpen] = useState(false); //!Modal框是否可见
    const [currentRights, setCurrentRights] = useState([]); //!当前选中角色的权限
    const [currentId, setCurrentId] = useState(0); //!当前选中角色的ID

    useEffect(() => {
        axios.get('/roles').then((res) => {
            setDataSource(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get('/rights?_embed=children').then((res) => {
            setTreeData(res.data);
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} />
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => { showModal(item) }} />
                </>
            }
        },
    ];

    const showConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                setDataSource(dataSource.filter(data => data.id !== item.id));
                axios.delete(`/roles/${item.id}`);
            },
        });
    }; //!删除按钮的确认框(是个函数形式)

    const showModal = (item) => {
        setIsModalOpen(true);
        setCurrentRights(item.rights);
        setCurrentId(item.id)
    }; //!显示Modal框

    const handleOk = () => {
        setIsModalOpen(false);
        setDataSource(dataSource.map(data => {
            if (data.id === currentId) {
                return { ...data, rights: currentRights };
            }
            return data
        }));
        axios.patch(`/roles/${currentId}`, { rights: currentRights });
    }; //!Modal框点击确定

    const handleCancel = () => {
        setIsModalOpen(false);
    }; //!Modal框点击取消

    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked);
    }; //!改变树形结构选中的元素

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id} />
            <Modal title="角色权限" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkStrictly={true}
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </Modal>
        </div>
    )
}
