
import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    ControlOutlined,
    SoundOutlined,
    AuditOutlined,
    SmileOutlined
} from '@ant-design/icons';
import './index.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Sider } = Layout;

const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <ControlOutlined />,
    "/news-manage": <SoundOutlined />,
    "/audit-manage": <AuditOutlined />,
    "/publish-manage": <SmileOutlined />

}

export default function SideMenu() {
    // const [collapsed] = useState(false);
    const {collapsed}=useSelector(state=>state.collapsed);

    const {role:{rights}}=JSON.parse(localStorage.getItem('token'));

    const [menu, setMenu] = useState([]);
    useEffect(() => {
        axios.get('/rights?_embed=children').then((res) => {
            setMenu(res.data);
        })
    }, []); //!获取后端数据，用于渲染Menu

    const isRoleRight=(item)=>{
        return rights.includes(item.key);
    }; //!将权限列表返回的数组和当前用户的权限进行比对

    const getItem = (arr) => {
        return arr.map(item => {
            if (item.children?.length > 0 && item.pagepermisson === 1&& isRoleRight(item)) {
                const subItems = getItem(item.children);
                return {
                    key: item.key,
                    label: item.title,
                    icon: iconList[item.key],
                    children: subItems,
                }
            } else {
                return item.pagepermisson === 1 && isRoleRight(item) && {
                    key: item.key,
                    label: item.title,
                    icon: iconList[item.key],
                }
            }
        })
    }
    const items = getItem(menu);

    const navigate = useNavigate();
    const onSelect = ({ key }) => {
        navigate(key, { replace: true });
    } //!回调函数，点击Menu，跳转对应路由页面

    const {pathname}=useLocation(); //!获取当前路由路径
    // console.log('/'+pathname.split('/')[1])

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo"  >全球新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu
                        onSelect={onSelect}
                        theme="dark"
                        mode="inline"
                        selectedKeys={[pathname]}
                        defaultOpenKeys={['/'+pathname.split('/')[1]]}
                        items={items}
                    />
                </div>
            </div>
        </Sider>
    )
}
