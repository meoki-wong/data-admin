import React, {lazy, ReactElement ,Suspense} from 'react'
// import { RouteObject } from 'react-router-dom' // hook导入
import Loading from '../view/components/Loading'
// import Test from "../test"
// import Test2 from '../test2'
import Home from '../home'

const Login = lazy(()=>import('../view/login/login'))
const Test = lazy(()=>import('../test'))
const Test2 = lazy(()=>import('../test2'))


const lazyComponent = (Element: ReactElement)=>{
    return (
        <Suspense fallback={<Loading />}>
             {Element}
        </Suspense>
    )
}
const routeList: any[] = [
    
    {
        name: 'kk',
        path: '/home',
        element: <Home />,
        children: [
            {
                name: '首页',
                path: '/home/details',
                index: true,
                element: lazyComponent(<Test />)
            },
            {
                name: '第二个首页',
                path: '/home/test2',
                element: lazyComponent(<Test2 />),
            },
        ]
    },
    

]


export default routeList