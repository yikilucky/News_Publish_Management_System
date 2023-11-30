import React, { useState, useEffect, useRef } from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Steps, Button, Form, Input, Select, message } from 'antd';
import style from './newsAdd.module.css';
import axios from 'axios';
import NewsEditor from '../../../components/sandbox/newsEditor/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewsAdd() {
    const [stepNumber, setStepNumber] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [newsForm, setNewsForm] = useState({});
    const [newsContent, setNewsContent] = useState(''); //!保存新建新闻和编辑新闻时的富文本编辑器内容
    const newsRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data.map(item => {
                return {
                    value: item.id,
                    label: item.title,
                }
            }));
        })
    }, []); //!用于select下拉框

    useEffect(() => {
        //!当从编辑新闻跳到新建新闻时的几个重置操作
        newsRef.current.resetFields();
        setStepNumber(0);
        setNewsContent('');

        params.id && axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            const { title, categoryId } = res.data;
            newsRef.current.setFieldsValue({
                title,
                categoryId,
            });
            setNewsContent(res.data.content);
        })
    }, [params.id]) //!返回要编辑的新闻数据

    const handleNext = () => {
        if (stepNumber === 0) {
            newsRef.current.validateFields().then(res => {
                setNewsForm(res);
                setStepNumber(stepNumber + 1);
            })
        } else {
            if (newsContent === '' || newsContent.trim() === '<p></p>') {
                message.error('新闻内容不能为空');
            } else {
                setStepNumber(stepNumber + 1);
            }
        }
    }//!button'下一步'的回调函数

    const handleSave = (auditState) => {
        if(params.id){
            axios.patch(`/news/${params.id}`, {
                ...newsForm,
                "content": newsContent,
                "auditState": auditState,
            }).then(() => {
                navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');//!跳转到相应页面
                message.success(`已保存到${auditState === 0 ? '草稿箱' : '审核列表'}中`)
            })
        }else{
            axios.post('/news', {
            ...newsForm,
            "content": newsContent,
            "region": user.region === '' ? '全球' : user.region,
            "author": user.username,
            "roleId": user.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
        }).then(() => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');//!跳转到相应页面
            message.success(`已保存到${auditState === 0 ? '草稿箱' : '审核列表'}中`)
        })
        }
        
    };//!button'保存草稿箱'和'提交审核'的回调函数

    return (
        <div>
            {
                params.id ? <PageHeader
                    title="更新新闻"
                    subTitle="This is a subtitle"
                    onBack={() => { navigate(-1) }}
                /> : <PageHeader
                    title="撰写新闻"
                    subTitle="This is a subtitle"
                />
            }


            <Steps
                current={stepNumber}
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题，新闻分类',
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主题内容',
                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                    },
                ]}
            />

            <div style={{ marginTop: '50px' }}>
                <div className={stepNumber === 0 ? '' : style.hidden}>
                    <Form
                        name="basic"
                        autoComplete="off"
                        ref={newsRef}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your title!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your categoryId!',
                                },
                            ]}
                        >
                            <Select
                                options={categoryList}
                            />
                        </Form.Item>
                    </Form>
                </div >

                <div className={stepNumber === 1 ? '' : style.hidden}>
                    <NewsEditor saveContent={(content) => { setNewsContent(content) }} updateContent={newsContent} />
                </div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {
                    stepNumber === 2 && <span>
                        <Button type="primary" onClick={() => { handleSave(0) }}>保存草稿箱</Button>
                        <Button danger onClick={() => { handleSave(1) }}>提交审核</Button>
                    </span>
                }
                {
                    stepNumber < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    stepNumber > 0 && <Button onClick={() => { setStepNumber(stepNumber - 1) }}>上一步</Button>
                }
            </div>
        </div>
    )
}
