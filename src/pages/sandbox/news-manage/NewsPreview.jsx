import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';


export default function NewsPreview() {
    const params = useParams();
    const navigate = useNavigate();
    const [newsInfo, setNewsInfo] = useState(null)

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo(res.data);
        })
    }, [params.id])

    const auditList = ['未审核', '审核中', '已通过', '未通过'];
    const publishList = ['未发布', '待发布', '已上线', '已下线'];

    const colorList=['black','orange','green','red'];

    return (
        <div>
            {
                //!用&&判断一下ajax请求是否返回(在后面用可选链newsInfo？.title，但要改很多地方，麻烦)
                newsInfo && <>
                    <PageHeader
                        ghost={false}
                        onBack={() => navigate(-1)}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态" ><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态"><span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div style={{border:'1px solid black',margin:'0 16px'}} dangerouslySetInnerHTML={{__html:newsInfo.content}} />
                </>
            }

        </div>
    )
}
