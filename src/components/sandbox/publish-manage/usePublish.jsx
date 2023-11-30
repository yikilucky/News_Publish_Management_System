import axios from 'axios';
import { useEffect, useState } from 'react'
import { message, } from 'antd';


export default function usePublish(publishState){
    const [dataSource, setDataSource] = useState([]);

    const { username } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${publishState}&_expand=category`).then((res) => {
            // console.log(res.data);
            setDataSource(res.data);
        });
    }, [username,publishState])

    const handlePublish=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id));
        axios.patch(`/news/${id}`,{
            publishState:2,
            publishTime:Date.now(),
        }).then(()=>{
            message.success('操作成功')
        })
    } //!发布按钮的回调函数

    const handleSunset=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id));
        axios.patch(`/news/${id}`,{
            publishState:3,
        }).then(()=>{
            message.success('操作成功')
        })
    } //!下线按钮的回调函数

    const handleDelete=(id)=>{
        setDataSource(dataSource.filter(item=>item.id!==id));
        axios.delete(`/news/${id}`).then(()=>{
            message.success('操作成功')
        });
    } //!删除按钮的回调函数

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    }
}