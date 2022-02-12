import React, {useState, useEffect} from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import {useNavigate} from 'react-router-dom'
import loginStyl from './login.module.scss'
import axios from 'axios';
// import { setCookieFn } from '../../utils/setCookie'
// import {Base64} from 'js-base64'
// import md5 from 'js-md5'
import Cookies from 'js-cookie' 
export default function Login() {

  let navigate = useNavigate()

  const onFinish = (values :any) => {
    console.log('Success:', document.cookie);
  };

  useEffect(()=>{
      // console.log('--->', `username="123"; expires=${new Date().toUTCString()}`);
      // // document.cookie = `username="123"; expires=${new Date().toUTCString()}`
      // var d = new Date();
      // d.setTime(d.getTime());
      // var expires = "expires="+d
      // console.log('----->', d);
      // document.cookie = 'cname' + "=" + 'cvalue' + "; " + expires;
      
  },[])

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  let [rules, setRules] = useState([
    {
      required: true, 
      message: 'Please input the content!',
    },
  ])
  let [userName, setUserName] = useState(null)
  let [password, setPassWord] = useState(null)
  let [checkBox, setCheckBox] = useState(true)

  let getUser = (e: any)=>{
    setUserName(e.target.value)
  }
  let getPassword = (e: any)=>{
      setPassWord(e.target.value)
  }
  
  let login = ()=>{
    axios.post('/login', {userName, password,checkBox}).then((res: any)=>{
      if(res.data.code === 200){
        if(checkBox){
          // setCookieFn({name: 'kk2', value: {
          //   userName: 'admin',
          //   password: '12345'
          // }, time: 7})  // 测试记住我功能  存入cookie
          Cookies.set('kk2', JSON.stringify({
            userName: 'admin',
            password: '12345'
          }), {expires: 7})
          window.localStorage.setItem('kk', '12') // localstroage存储记住我登录状态 进入后判断是否有该状态进行跳转
        }
        let token = res.data.token
        window.localStorage.setItem('token', token)
        message.success('登录成功')
        navigate('/home')
      }
      

    })
  }
  let onCheckRember=(e:any)=>{
    setCheckBox(e.target.checked)
  }
  return (
    <div className={loginStyl.container}>
        <div className={loginStyl.formArea}>
        <Form
      name="basic"
      style={{width: '100%'}}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 18,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={rules}
      >
        <Input onChange={(e)=>getUser(e)}/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={rules}
      >
        <Input.Password onChange={(e)=>getPassword(e)}/>
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Checkbox  
        onChange={(e)=>onCheckRember(e)}
        checked={checkBox}
        style={{color: '#fff'}}>记住我</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary"
         htmlType="submit"
        onClick={login}
        style={{marginRight: '30px'}}>
          登录
        </Button>
        <Button type="primary" htmlType="submit" onClick={()=>navigate('/register')}>
          注册
        </Button>
      </Form.Item>
    </Form>
        </div>
    </div>
    
  );
};




/**
 * 
 * 生成特殊cookie  将cookie对应账号密码传入服务端
 * 
 * 服务端传递加密账号密码
 * 
 * 前端解密  创建登录
 */