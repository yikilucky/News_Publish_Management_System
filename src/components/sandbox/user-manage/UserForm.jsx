import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';

const UserForm = forwardRef((props,userForm) => {
    const { regionList, roleList, isUpdateDisabled,flag} = props;
    let regionSelect=[], roleSelect=[];

    const [isDisabled, setIsDisabled] = useState(false);

    const {roleId, region}=JSON.parse(localStorage.getItem('token'));

    // console.log(isUpdateDisabled)
    useEffect(()=>{setIsDisabled(isUpdateDisabled)},[isUpdateDisabled]) //!更新用户中

    //!第一层if判断是添加还是编辑用户，第二层if判断是超级管理员还是区域管理员
    if(flag){
        if(roleId===1){
            regionSelect=regionList.map(data => {
                return {
                    value: data.value,
                    label: data.title,
                }
            });
            roleSelect=roleList.map(data => {
                return {
                    value: data.roleType,
                    label: data.roleName,
                }
            })
        }else{
            regionSelect=regionList.map(data => {
                return {
                    value: data.value,
                    label: data.title,
                    disabled:true,
                }
            });
            roleSelect=roleList.map(data => {
                return {
                    value: data.roleType,
                    label: data.roleName,
                    disabled:true,
                }
            })
        }
    }else{
        if(roleId===1){
            regionSelect=regionList.map(data => {
                return {
                    value: data.value,
                    label: data.title,
                }
            });
            roleSelect=roleList.map(data => {
                return {
                    value: data.roleType,
                    label: data.roleName,
                }
            })
        }else{
            regionSelect=regionList.map(data => {
                if(data.title===region){
                    return {
                        value: data.value,
                        label: data.title,
                    }
                }
                return {
                    value: data.value,
                    label: data.title,
                    disabled:true,
                }
            });
            roleSelect=roleList.map(data => {
                if(data.roleType===3){
                    return {
                        value: data.roleType,
                        label: data.roleName,
                    }
                }
                return {
                    value: data.roleType,
                    label: data.roleName,
                    disabled:true,
                }
            })
        }
    } //!不同角色在添加用户和编辑用户时是有权限限制的，比如区域管理员只能添加当前区域的区域编辑，那么别的区域和别的角色都要禁用

    const changeRole = (value) => {
        if (value === 1) {
            setIsDisabled(true);
            userForm.current.setFieldsValue({region:''});
        }else{
            setIsDisabled(false);

        }
    }; //!改角色选项，如果改成超级管理员，那么区域选项清空且禁用



    return (
        <Form
            layout="vertical"
            ref={userForm}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled?[]:[
                    {
                        required: true,
                        message: 'Please input your region!',
                    },
                ]}
            >
                <Select
                    disabled={isDisabled}
                    options={regionSelect}
                />
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input your roleId',
                    },
                ]}
            >
                <Select
                    onChange={changeRole}
                    options={roleSelect}
                />
            </Form.Item>
        </Form>
    )
})

export default UserForm;