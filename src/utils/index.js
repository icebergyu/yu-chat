export function getRedirectTo(type,avatar){
    let path=''
    if(type==='vue'){
        path='/vue'
    }else{
        path='/react'
    }
    if(!avatar){
        path+='info'
    }
    return path
}

