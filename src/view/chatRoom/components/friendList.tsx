import React, { useEffect, useState, memo } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./friendList.scss";
import { request } from "@/api/request";
import { SelectItem } from "../interface/SelectItem";
import { socketIo } from "../utils/newSocket";
import { Badge } from 'antd';
import getMsgCountStore from '../../../store/store/getMessageCount'
import msgCountStore from '../../../store/store/getMessageCount'
type FriendList = Array<object>;
type FriendUserObject = {
  [key: number | string]: {
      msgCount: number
  }
}
function FriendList(props: any) {
  let navigate = useNavigate();
  let { socket } = socketIo;
  let [friendList, setFriendList] = useState<FriendList>([]);
  let [msgCount, setMsgCount] = useState<FriendUserObject>({})
  useEffect(() => {
    getFriendList();
  }, []);
  useEffect(() => {
    socket.on("addFriendSuccess", () => {
      getFriendList();
    });
    // 在线
    socket.on("userStatus", (item: number) => {
      let userId = JSON.parse(localStorage.getItem('userInfo')!).id
      if(userId !== item){ // 过滤排除自己
        const statusDom = document.querySelector(`.user-status-${item}`) as HTMLElement
        const statusWord = document.querySelector('.user-status-word') as HTMLElement
        statusWord.innerHTML = '在线'
        statusDom.style.backgroundColor = 'green'
        
      }
    });
    // 离线
    socket.on("quitItem", (quitItem: any) => {
      if(quitItem && friendList.length){
        let statusDom = document.querySelector(`.user-status-${quitItem}`) as HTMLElement
        let statusWord = document.querySelector('.user-status-word') as HTMLElement
        statusWord.innerHTML = '离线'
        statusDom.style.backgroundColor = '#bbb'
      }
      
    });
  }, []);
  const getFriendList = () => {
    request
      .post("/getFirends", {
        userId: JSON.parse(localStorage.getItem("userInfo")!).id,
      })
      .then((res) => {
        setFriendList(res.data.list);
        let friendObj: FriendUserObject = {}
      
        res.data.list?.map((item: {UserId: string})=>{
          friendObj[item.UserId] = {msgCount: 0}
        })
        props.getFriendDispatch(friendObj)
      //     msgCountStore.dispatch({
      //     type: "addUser",
      //     value: friendObj
      // })
        console.log('-----props相关参数', props);
          // console.log('-----getMsgCountStore.getState().value', getMsgCountStore.getState());
          setMsgCount(getMsgCountStore.getState())
        })
  };
  const chatFriends = (item: SelectItem) => {
    navigate(`/dataAdmin/ChartRoom/friend`, {
      state: {
        id: item.id,
        userName: item.userName,
      },
    });
  };
  return (
    <div className="friend-list">
      <ul>
        {friendList?.map((item: any) => {
          return (
            <li
              key={item.id}
              className="contant-item"
              onClick={() => chatFriends(item)}
            >
              <Badge count={props.getCount[item.UserId]?.msgCount}>
                <div className="item-header">
                  <img
                    src={item.headerImg}
                    alt=""
                  />
                </div>
              </Badge>
              
              <div className="item-desc">
                <div className="name">
                  {item.userName}
                  <span className="user-number">（{item.user_number}）</span>
                  <span className={`user-status-box `}>
                    <i style={{ backgroundColor: item.userOnlineStatus.userStatus ? 'green' : ''}} className={`user-status-${item.UserId}`}></i><span className="user-status-word">{item.userOnlineStatus.userStatus?'在线' : '离线'}</span>
                  </span>
                </div>
                <div className="desc">{item.selfIntroduce || '他很懒，啥都没写~'}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
  
}
const mapStateToProps = (state: any, ownProps: any) => {
  console.log("---kkkkkkkkk", state.getMessageCount, ownProps);
  return {
    getCount: state.getMessageCount,
  };
};
const mapDispatchToProps = (dispatch: any, ownProps: any) => {
return {
  getFriendDispatch: (item: FriendList) => {
    dispatch({
      type: 'addUser',
      value: item
    })
  }
}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendList);
