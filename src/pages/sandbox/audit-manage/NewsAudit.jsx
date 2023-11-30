import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd';
import { Link } from 'react-router-dom';

export default function NewsAudit() {
    const [dataSource, setDataSource] = useState([]);
    const { roleId, username, region } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get('/news?auditState=1&_expand=category').then((res) => {
            if (roleId === 1) {
                setDataSource(res.data);
            } else {
                setDataSource(res.data.filter(item => {
                    return item.author === username || (item.roleId === 3 && item.region === region);
                }));
            }
        }) //!不同角色能审核的新闻不同(超级管理员能审核所有，区域管理员只能审核自己和同区域下的区域编辑)
    }, [roleId, username, region])

    const handleAudit=(item,auditState,publishState)=>{
        setDataSource(dataSource.filter(data=>data.id!==item.id));
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(()=>{
            message.success('操作成功');
        })
    } //!两个button的回调函数


    const columns = [
        {
            title: '新闻标题',
            render: (item) => <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
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
                <Button shape="circle" type="primary" onClick={() => { handleAudit(item,2,1) }} >√</Button>
                <Button shape="circle" danger type="primary" onClick={() => { handleAudit(item,3,0) }} >X</Button>
                </>}


        },
    ];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
