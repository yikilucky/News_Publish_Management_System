import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, message, } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const { confirm } = Modal;

export default function NewsDraft() {
    const [dataSource, setDataSource] = useState([]);

    const navigate = useNavigate();

    const { username } = JSON.parse(localStorage.getItem('token'));


    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then((res) => {
            // console.log(res.data);
            setDataSource(res.data);
        });
    }, [username]) //!返回当前用户未审核的新闻

    const submitToAudit = (item) => {
        axios.patch(`/news/${item.id}`, {
            auditState: 1,
        }).then(() => {
            navigate('/audit-manage/list');//!跳转到相应页面
            message.success('已保存到审核列表中')
        })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            render: (item) => item.category.title
        },
        {
            title: '操作',
            render: (item) => {
                return <>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} />
                    <Link to={`/news-manage/update/${item.id}`}><Button shape="circle" icon={<EditOutlined />} /></Link>
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => { submitToAudit(item) }} />
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
                axios.delete(`/news/${item.id}`);
            },
        });
    }; //!删除按钮的确认框(是个函数形式)



    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}

