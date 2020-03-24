/**
 * API Action - Check in
 * Provides the same functionality of the check in button, but callabel via the API. Unlike the button action, 
 * there will not be a userinfo record in context. We will get the logged in user and find the related userinfo record
 * before performing the check in logic. 
 * 
 * It checks if a log record without an end date already exists for this user (ie the user is already checked in).
 * If not it checks the user in by creating a new Log record. Otherwise it returns an error. 
 */

async function getUserInfoId() {    
            
    try {                                    
        const userInfo = await stryke.findOne(`{ Userinfo (filter : {                                    
            user :{ eq: "${stryke.user.id}" }
            }) {
                id
            }
        }`);         
        return  userInfo.id;
    }
    catch (err) {
        console.error('error: ' + err.message);
        stryke.error(`Failed to retrieve the user's details`);
    }      
}

async function createLogForCheckIn() {

    const userInfoId = await getUserInfoId();    
    
    try {

        const result = await stryke.find(`{ Log (filter : {                                    
                        userinfo :{ eq: "${userInfoId}" },
                        endDate : { isn : null }
                        }) {
                            id
                        }
                    }`);

        if (result !== null && result.length === 0) {                                                   
                const newCheckedInLog = {
                    userinfo : userInfoId, 
                    startDate: new Date().toISOString()
                }  

                stryke.create('log', newCheckedInLog).then((responseData) => {                                    
                    console.log('Log created with id: ' + responseData.id);
                    stryke.resolve('User checked in!');
                }).catch((err) => {
                    console.log('failed to create log record for check in: '+ err.message);
                    stryke.error('Could not check in user!');
                });
        } else {
            console.log('Checked in log record already eists: ' + result[0].id);
            stryke.error('Check in failed! The user is already checked in.');
        }
    } catch(err) {
        console.log('Query for existing log failed: ' + result[0].id);
        stryke.error('Check in failed! Could not check whether the user is already checked in, please try again.');
    }    
}

createLogForCheckIn();