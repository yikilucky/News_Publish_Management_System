import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get('/rights?_embed=children').then((res) => {
            setDataSource(res.data.map(item => {
                if (item.children.length === 0) {
                    item.children = '';
                }
                return item;
            })); //!先处理返回的数据，用map遍历数组(数组元素是对象)，处理children属性值是空数组的数组元素
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: (key) => <Tag color="orange">{key}</Tag>
        },
        {
            title: '操作',
            render: (item) => {
                return <>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} />
                    <Popover content={<div style={{textAlign:'center'}}>
                        <Switch checked={item.pagepermisson} onChange={() => { onChange(item) }} />
                    </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"} style={{ textAlign: 'center' }}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>
                </>
            }


        },
    ];

    const showConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                //!用item.grade来确定是删一级还是二级菜单项
                if (item.grade === 1) {
                    setDataSource(dataSource.filter(data => data.id !== item.id));
                    axios.delete(`/rights/${item.id}`);
                } else {
                    const list = dataSource.filter(data => data.id === item.rightId);
                    list[0].children = list[0].children.filter(data => data.id !== item.id);
                    setDataSource([...dataSource]);
                    axios.delete(`/children/${item.id}`);
                }
            },
        });
    }; //!删除按钮的确认框(是个函数形式)

    const onChange = (item) => {
        //!item和dataSource中的对应项是相同引用，改变item就改变了dataSource
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1; //!编辑按钮用来改变pagepermisson属性，1改0,0改1
        setDataSource([...dataSource]);
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
        } else {
            axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
        }
    } //!编辑按钮的Switch变化的回调

    
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item=>item.id} />
        </div>
    )
}
