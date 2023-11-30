import React from 'react'
import { Table, } from 'antd';
import { Link } from 'react-router-dom';
export default function NewsPublish(props) {
    const {dataSource, button}=props;
    const columns = [
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
                return button(item.id);
            }


        },
    ];





    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
