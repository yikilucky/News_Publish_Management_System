import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Descriptions, message } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';


export default function Detail() {
    const params = useParams();
    const navigate = useNavigate();
    const [newsInfo, setNewsInfo] = useState(null)

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo({
                ...res.data,
                view:res.data.view+1,
            });
            return res.data;
        }).then(res=>{
            axios.patch(`/news/${params.id}`,{
                view:res.view+1,
            })
        })
    }, [params.id]) //!每次刷新访问数量+1

    const addStar=()=>{
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1,
        })

        axios.patch(`/news/${params.id}`,{
            star:newsInfo.star+1,
        }).then(()=>{
            message.success('点赞成功')
        })
    } //!点赞爱心的回调函数


    return (
        <div>
            {
                //!用&&判断一下ajax请求是否返回(在后面用可选链newsInfo？.title，但要改很多地方，麻烦)
                newsInfo && <>
                    <PageHeader
                        ghost={false}
                        onBack={() => navigate(-1)}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                <span>{newsInfo.category.title}</span>
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={addStar} />
                            </div>
                            
                        }
                        
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div style={{ border: '1px solid black', margin: '0 16px' }} dangerouslySetInnerHTML={{ __html: newsInfo.content }} />
                </>
            }

        </div>
    )
}

