const PERMISSION = {


    user: {
        
        "user": ["GET", "POST", "PATCH", "DELETE"]

    },
    admin: {
        "user": ["GET", "POST", "PATCH", "DELETE"],
        "admin": ["GET", "POST", "PATCH", "DELETE"],
        
    }


}


const isAuth =  (role, route, method) => {
    
    

    const permission = PERMISSION[role];
    

    const rolePermissionsArray = permission[route];
    
    if(!rolePermissionsArray){
       
        return false
    }

    
    const idx = rolePermissionsArray.indexOf(method);
    

    if(idx < 0 ){
        return false;
    } 
    return true;
}

module.exports = isAuth;