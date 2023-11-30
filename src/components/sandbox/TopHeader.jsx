import React from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, Layout, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCollapsed } from '../../redux/slices/collapsedSlice';
const { Header } = Layout;

export default function TopHeader() {

    const {collapsed}=useSelector(state=>state.collapsed);
    // console.log(collapsed);
    const dispatch=useDispatch();

    const{username, role}=JSON.parse(localStorage.getItem('token'));
    // const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const changeCollapsed = () => {
        // setCollapsed(!collapsed);
        dispatch(setCollapsed(!collapsed));
    }

    const items = [
        {
            key: '1',
            label: role.roleName,
        },
        {
            key: '2',
            danger: true,
            label: '退出',
            onClick: () => {
                localStorage.removeItem('token');
                navigate('/login');
            }, //!退出按钮绑定事件
        },
    ];

    return (
        <Header
            style={{
                padding: '0 16px',
                background: colorBgContainer,
            }}
        >
            {
                collapsed ? <MenuFoldOutlined onClick={changeCollapsed} /> : <MenuUnfoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <Avatar size={'large'} icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
