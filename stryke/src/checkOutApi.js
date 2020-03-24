/**
 * API Action - Check Out
 * Provides the same functionality of the check out button, but callabel via the API. Unlike the button action, 
 * there will not be a userinfo record in context. We will get the logged in user and find the related userinfo record
 * before performing the check out logic. 
 * 
 * It checks if an active log record without an end date already exists for this user (ie the user is already checked in).
 * If it does, it checks the user out by setting the end date to now on that Log record. Otherwise it returns an error. 
 */

async function getUserInfo() {
    
    try {                                    
        const userInfo = await stryke.findOne(`{ Userinfo (filter : {                                    
            user :{ eq: "${stryke.user.id}" }
            }) {
                id, firstname
            }
        }`);         
        return userInfo;
    }
    catch (err) {
        console.error('error: ' + err.message);
        stryke.error(`Failed to retrieve the user's details`);
    }  
}

async function checkOut() {

    let userInfo = await getUserInfo();

    const queryForCheckedInLogs = `{  Log (filter : {                                    
        userinfo :{ eq: "${userInfo.id}" },
        endDate : { isn : null }
        }) {
            id
        }
    }`;
    
    stryke.find(queryForCheckedInLogs).then((result) => {
                
        if (result && result.length === 0) {
            // user not checked in
            console.error(userInfo.firstname + ' is not checked in!');
            stryke.error(userInfo.firstname + ' is not checked in!');
        }
        else if (result.length === 1) {
            // edit the active log
            const currentTime = new Date;
            const updateData = { endDate : currentTime.toISOString() };
            const logId = result[0].id;
            stryke.update(logId, updateData).then((responseData) => {            
                console.log('Log updated. End date: ' + responseData.endDate);
                stryke.resolve(userInfo.firstname + ' checked out!');
            }).catch((err) => {
                console.log('failed to update log record for check out: '+ err.message);
                stryke.error('Check out failed! ' + + err.message);
            });
        }
        else {            
            // user has more than one open log! error!
            stryke.error(userInfo.firstname + ' has many opened log entries. Contact your administrator!');        
        }     
    }).catch((err) => {
        console.error('Check out failed: ' + err.message);
        stryke.error('Check out failed!');
    });
}

checkOut();