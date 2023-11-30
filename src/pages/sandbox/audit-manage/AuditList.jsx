import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function AuditList() {
    const [dataSource, setDataSource] = useState([]);
    const navigate = useNavigate();

    const { username } = JSON.parse(localStorage.getItem('token'));

    const colorList = ['', 'orange', 'green', 'red'];
    const operateList = ['', '撤销', '发布', '修改',];
    const auditList = ['', '审核中', '已通过', '未通过'];


    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username])

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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
        },
        {
            title: '操作',
            render: (item) => <Button type="primary" onClick={() => { operateNews(item) }} >{operateList[item.auditState]}</Button>


        },
    ];

    const operateNews = (item) => {
        if (item.auditState === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.patch(`/news/${item.id}`, { auditState: 0 }).then(() => {
                message.success('您可以到草稿箱中查看您的新闻');
            });
        } else if (item.auditState === 2) {
            axios.patch(`/news/${item.id}`, { publishState: 2, publishTime:Date.now() }).then(() => {
                navigate('/publish-manage/published');//!跳转到相应页面
                message.success('已保存到已发布列表中')
            })
        } else {
            navigate(`/news-manage/update/${item.id}`);
        }
    } //!Button的回调函数

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
