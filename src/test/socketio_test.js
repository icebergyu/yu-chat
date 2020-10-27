import io from 'socket.io-client'
// 连接服务器
const socket = io('ws://localhost:5000')
socket.emit('sendMsg',{name:'giao'})
socket.on('receiveMsg',function(data){
    console.log('客户端接收服务器发送的消息',data)
})