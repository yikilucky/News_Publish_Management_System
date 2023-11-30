import React from 'react'
import { useRoutes } from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandBox from '../pages/sandbox/NewsSandBox'
import Detail from '../pages/visitor/Detail'
import News from '../pages/visitor/News'

export default function IndexRouter() {
  const route=useRoutes([
    {
      path:"/login",
      element:<Login/>
    },
    {
      path:"/news",
      element:<News/>
    },
    {
      path:"/detail/:id",
      element:<Detail/>
    },
    {
      path:"/*", //!父路由要加*
      element:localStorage.getItem("token")?<NewsSandBox/>:<Login/>
    }
  ])
  return (
    <>
      {route}
    </>
  )
}