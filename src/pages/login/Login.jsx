import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then((res) => {
            // console.log(res.data)
            if (res.data.length) {
                localStorage.setItem('token', JSON.stringify(res.data[0]));
                navigate('/home');
            } else {
                message.error('用户名或密码不匹配');
            }
        })
    }; //!校验用户，利用查询URL，若返回的数组长度为1，表明校验通过；若是空数组，则校验失败

    return (
        <div style={{ background: 'rgb(35,39,65)', height: '100%', position: 'relative' }}>
            <div className='formContainer'>
                <div className='loginTitle'>全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}
