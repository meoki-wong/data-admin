import React, {ReactElement, useEffect} from 'react'
import ReactRouter from './ReactRouter'
import {Routes, Route, useLocation, useNavigate, Navigate} from 'react-router-dom'
import Login from '../view/login/login'
import Home from '../home'
import Cookies from 'js-cookie'
import axios from 'axios'
// 跳转登录页组件
let RedirectLogin = ()=>{
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
    )
}
let RedirectHome = ()=>{
    return (
        <>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </>
    )
}



export default function UseRoute() {
    let navigate = useNavigate()
    let token = window.localStorage.getItem('token')
    let ElementRoute = ()=>{
        if(!token){
            return <RedirectLogin /> 
        } 
        else {
            return <ReactRouter />
        }
    }
    return (
        <>
            <ElementRoute/>
        </>
    )
}



/**
 * 本组件作为全局的路由守卫
 * 鉴权   免密码登录等操作
 * 
 * 
*/