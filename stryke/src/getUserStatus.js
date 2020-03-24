/**
 * API Action - Get User Status
 * 
 * Returns whether the logged in user is currently checked in or checked out. 
 */
getUserStatus();

async function getUserStatus() {

    const userInfo = await getUserInfo();            

    try {
        const checkedInLogs = await stryke.find(`{ Log (filter : {                                    
                userinfo :{ eq: "${userInfo.id}" }   
                endDate : { isn : null }                                     
                }) {
                    id, alias, startDate, endDate, 
                    project { id, alias },
                    task { id, alias },
                    userinfo { id, alias }
                }
            }`);        
        const activeLog = checkedInLogs[0];

        const response = {
            status: activeLog ? 'in' : 'out',
            userInfo,
            activeLog
        }

        console.log('User Satus: ' + response.status);
        stryke.resolve(response);
    }
    catch (err) {
        stryke.error(`Failed to get the user's status`);
    }
}

async function getUserInfo() {
    
    try {                                    
        const userInfo = await stryke.findOne(`{ Userinfo (filter : {                                    
            user :{ eq: "${stryke.user.id}" }
            }) {
                id, firstname, lastname, alias
            }
        }`);         
        return userInfo;
    }
    catch (err) {
        console.error('error: ' + err.message);
        stryke.error(`Failed to retrieve the user's details`);
    }  
}