
import { message } from "antd";

const RouteAccount = (AMap: any, AMapContain: any, keywordList:Array<string>) => {


    // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
    let walkingOption = {}

    // 步行导航
    const walking = new AMap.Walking(walkingOption)
    const autoComplete = new AMap.AutoComplete({
        city: '全国'
    })

    autoComplete.search(keywordList, function (status: string, result: any) {
        // 搜索成功时，result即是对应的匹配数据
        console.log('-----。查询结果', result, keywordList);

        
    })

    //根据起终点坐标规划步行路线
    walking.search([116.399028, 39.845042], [116.436281, 39.880719], function(status: string, result: any) {
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
                message.success('绘制步行路线完成')
            }
        } else {
            message.error('步行路线数据查询失败' + result)
        } 
    });

    const drawRoute = (route: any)=> {
        var path = parseRouteToPath(route)

        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: AMapContain,
            anchor: 'bottom-center',
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: AMapContain,
            anchor: 'bottom-center',
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            strokeOpacity: 0.9,
            lineJoin: 'round'
        })

        AMapContain.add(routeLine);

        // 调整视野达到最佳显示区域
        AMapContain.setFitView([ startMarker, endMarker, routeLine ])
    }

    // 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
    // WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
    const parseRouteToPath = (route: any)=> {
        var path = []

        for (var i = 0, l = route.steps.length; i < l; i++) {
            var step = route.steps[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }

        return path
    }
}

export default RouteAccount