import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Modal, Switch } from 'antd';
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import UserForm from '../../../components/sandbox/user-manage/UserForm';
import { flushSync } from 'react-dom';
const { confirm } = Modal;

export default function UserLIst() {
    const [dataSource, setDataSource] = useState([]); //!Table组件数据
    const [regionList, setRegionList] = useState([]); //!筛选结构以及Selector结构数据
    const [roleList, setRoleList] = useState([]); //!Selector结构数据
    const [isModalOpen, setIsModalOpen] = useState(false); //!Modal框是否可见
    const [flag, setFlag] = useState(0); //!Modal框是否可见
    const [currentId, setCurrentId] = useState(0);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false); //!更新用户的Modal框，如果是超级管理员就禁用区域项，这里要父传子
    const userForm = useRef();

    const{roleId, username, region}=JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get('/users?_expand=role').then((res) => {
            if(roleId===1){
                setDataSource(res.data);
            }else{
                setDataSource(res.data.filter(item=>{
                    return item.username===username||(item.roleId===3&&item.region===region);
                }));
            } //*这块儿if判断可以用三目
        }) //!不同角色能看到的用户不同(超级管理员看见所有用户；区域管理员看见自己和其区域下的区域编辑；区域编辑不用考虑，因为没这路由
    }, [roleId,username,region])

    useEffect(() => {
        axios.get('/regions').then((res) => {
            setRegionList(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get('/roles').then((res) => {
            setRoleList(res.data);
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (region, item) => <b>{item.region ? region : '全球'}</b>,
            filters: [{ text: '全球', value: '' }, ...regionList.map(data => {
                return {
                    text: data.title,
                    value: data.value,
                }
            })],
            onFilter: (value, item) => item.region === value,
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => role.roleName,
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            render: (item) => <Switch checked={item.roleState} onChange={() => { changeState(item) }} disabled={item.default}>{item.roleState}</Switch>,
        },
        {
            title: '操作',
            render: (item) => {
                return <>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} disabled={item.default} />
                    <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => { showUpdateModal(item) }} disabled={item.default} />
                </>
            },
        },
    ];

    const changeState = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);

        axios.patch(`/users/${item.id}`, { roleState: item.roleState });
    } //!开或关Switch按钮

    const showConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                setDataSource(dataSource.filter(data => data.id !== item.id));
                axios.delete(`/users/${item.id}`);
            },
        });
    }; //!删除按钮的确认框(是个函数形式)

    const showAddModal = () => {

        flushSync(() => {
            setFlag(0);
            setIsModalOpen(true);
        });
        userForm.current.resetFields();

    }; //!显示添加用户Modal框

    const showUpdateModal = (item) => {
        flushSync(() => {
            setFlag(1);
            setIsModalOpen(true);
            setCurrentId(item.id);
            setIsUpdateDisabled(item.roleId === 1)
        });
        userForm.current.setFieldsValue(item);

    }; //!显示更新用户Modal框

    const onOk = () => {
        if (flag === 0) {
            userForm.current.validateFields().then(values => {
                setIsModalOpen(false);
                axios.post('/users', { ...values, roleState: true, default: false }).then(res => {
                    setDataSource([...dataSource, { ...res.data, role: roleList.find(data => data.id === res.data.roleId) }])
                })
            }); //*拿到表单数据，先改后端自动生成id，然后再改状态（ Todo？？优化空间，嵌套axios ）
        } else {
            userForm.current.validateFields().then(values => {
                setIsModalOpen(false);
                setDataSource(dataSource.map(data => {
                    if (data.id === currentId) {
                        return { ...data, ...values,role:roleList.find(item => item.id === values.roleId) };
                    }
                    return data;
                }));
                axios.patch(`/users/${currentId}`, values);
            })
        }

    }; //!Modal框点击确定，根据flag走不同的逻辑

    const onCancel = () => {
        setIsModalOpen(false);
    }; //!Modal框点击取消



    return (
        <div>
            <Button type="primary" onClick={() => { showAddModal() }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
            <Modal
                open={isModalOpen}
                title={flag ? "更新用户" : "添加用户"}
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onOk}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={userForm} isUpdateDisabled={isUpdateDisabled} flag={flag} />
            </Modal>
        </div>
    )
}
