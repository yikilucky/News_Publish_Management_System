import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer  } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash';
import { flushSync } from 'react-dom';
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [ownList, setOwnList] = useState([]); //!保存用于饼图的数据
  const [drawerOpen, setDrawerOpen] = useState(false); //!抽屉组件是否打开
  const [pieChart, setPieChart] = useState(null); //!保存饼图初始化内容
  const barRef = useRef(null);
  const pieRef = useRef(null);

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    axios.get('/news?publishState=2&_sort=view&_order=desc&_limit=6&_expand=category').then(res => {
      setViewList(res.data);
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_sort=star&_order=desc&_limit=6&_expand=category').then(res => {
      setStarList(res.data);
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category').then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title)); //!渲染柱状图
    }) //!处理返回的柱状图数据，_.groupBy()返回的是对象

    return () => {
      window.onresize = null;
    } //!当组件销毁的时候清除窗口事件
  }, [])

  const renderBarView = (barData) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(barData),
        axisLabel: {
          interval: 0,
          rotate: 45,
        }
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(barData).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize();
    } // 响应式大小
  } //!渲染柱状图

  useEffect(() => {
    axios.get(`/news?publishState=2&author=${username}&_expand=category`).then(res => {
      setOwnList(res.data);
    })
  }, [username])

  const renderPieView=()=>{
    var myChart;
    if(!pieChart){
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart);
    }else{
      myChart=pieChart;
    } //!解决多次打开饼状图时重复初始化问题

    const newList=_.groupBy(ownList,item=>item.category.title);

    var option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: Object.entries(newList).map(item=>({
            value:item[1].length,
            name:item[0],
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    
    myChart.setOption(option);
  } //!渲染饼状图


  const onClose = () => {
    setDrawerOpen(false);
  }; //!drawer关闭的回调函数

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={()=>{
                flushSync(()=>{
                  setDrawerOpen(true);
                });
                renderPieView(); //!点击打开饼状图
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="/avatar.png" />}
              title={username}
              description={<div>
                <b>{region ? region : '全球'}</b>
                <span style={{ padding: '30px' }}>{roleName}</span>
              </div>}
            />
          </Card>
        </Col>
      </Row>

      <Drawer title="个人新闻分类" placement="right" onClose={onClose} open={drawerOpen} width='500px'>
      <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
      </Drawer>

      

      <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
    </div>
  )
}
