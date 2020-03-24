/**
 * Button Action - Check in
 * It checks if a log record without an end date already exists for this user (ie the user is already checked in).
 * If not it checks the user in by creating a new Log record. Otherwise it returns an error. 
 */
async function createLogForCheckIn() {

    const userInfoId = stryke.data.record.id;   
    
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