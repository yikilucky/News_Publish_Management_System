import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Card, Col, Row, List } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';


export default function News() {
    const [newsList, setNewsList] = useState([])

    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setNewsList(Object.entries(_.groupBy(res.data, item => item.category.title)));
        }) //!处理返回的新闻数据，_.groupBy()返回的是对象，然后再转成二维数组

    }, [])

    return (
        <div>
            <PageHeader
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div style={{ width: '95%', margin: '0 auto' }}>
                <Row gutter={[16, 16]}>
                    {
                        newsList.map(item => {
                            return (
                                <Col span={8} key={item[0]}>
                                    <Card title={item[0]} bordered={true} hoverable={true}>
                                        <List
                                            size="small"
                                            pagination={{
                                                pageSize: 3
                                            }}
                                            dataSource={item[1]}
                                            renderItem={(data) => <List.Item><Link to={`/detail/${data.id}`}>{data.title}</Link></List.Item>}
                                        />
                                    </Card>
                                </Col>
                            )
                        })
                    }


                </Row>
            </div>

        </div>
    )
}
