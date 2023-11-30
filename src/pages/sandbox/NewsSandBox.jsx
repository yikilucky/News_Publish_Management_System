import React, { useEffect, useState } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserLIst'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import NoPermission from './nopermission/NoPermission'
import { Layout, Spin, theme } from 'antd';
import NewsAdd from './news-manage/NewsAdd'
import NewsDraft from './news-manage/NewsDraft'
import NewsPreview from './news-manage/NewsPreview'
import NewsAudit from './audit-manage/NewsAudit'
import AuditList from './audit-manage/AuditList'
import PublishUnpublished from './publish-manage/PublishUnpublished'
import PublishPublished from './publish-manage/PublishPublished'
import PublishSunset from './publish-manage/PublishSunset'
import axios from 'axios'
import './NewsSandBox.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Category from './news-manage/Category'
import { useSelector } from 'react-redux'
const { Content } = Layout;



export default function NewsSandBox() {
    NProgress.start();
    useEffect(()=>{
        NProgress.done();
    }) //!设置进度条
    const routerList = {
        "/home": <Home />,
        "/user-manage/list": <UserList />,
        "/right-manage/role/list": <RoleList />,
        "/right-manage/right/list": <RightList />,
        "/news-manage/add": <NewsAdd />,
        "/news-manage/draft": <NewsDraft />,
        "/news-manage/category": <Category />,
        "/audit-manage/audit": <NewsAudit />,
        "/audit-manage/list": <AuditList />,
        "/publish-manage/unpublished": <PublishUnpublished />,
        "/publish-manage/published": <PublishPublished />,
        "/publish-manage/sunset": <PublishSunset />,
        "/news-manage/preview/:id": <NewsPreview />,
        "/news-manage/update/:id": <NewsAdd />
    } //!本地映射表，例如'/user-manage'是没有对应组件的

    const [rightList, setRightList] = useState([]);
    useEffect(() => {
        Promise.all([axios.get('/rights'), axios.get('/children')]).then(res => {
            setRightList([...res[0].data, ...res[1].data].filter(item=>item.pagepermisson||item.routepermisson));
        })
    }, []) //!权限列表返回的扁平化数组

    const { role:{rights} } = JSON.parse(localStorage.getItem('token')); //!用户的权限

    const newsRoutes = rightList.filter(item => rights.includes(item.key) && routerList[item.key]).map(item => {
        return {
            path: item.key,
            element: routerList[item.key],
        }
    }) //!三表比对
    /* console.log(rightList)
    console.log(rights)
    console.log(newsRoutes) */
    const router = useRoutes([
        ...newsRoutes,
        {
            path: "/",
            element: <Navigate replace to="/home" /> //!重定向
        },
        {
            path: "*",
            element: rightList.length?<NoPermission />:"" //!默认路由(不匹配上述路由的其它路由)
        }
    ])
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const {isLoading}=useSelector(state=>state.loading);

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow: 'auto',
                    }}
                >
                    <Spin size="large" spinning={isLoading}>
                        {router}
                    </Spin>
                    
                </Content>
            </Layout>
        </Layout>
    )
}