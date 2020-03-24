/**
 * Button Action - Check out
 * It checks if an active log record without an end date already exists for this user (ie the user is already checked in).
 * If it does, it checks the user out by setting the end date to now on that Log record. Otherwise it returns an error. 
 */
const queryForCheckedInLogs = `{  Log (filter : {                                    
    userinfo :{ eq: "${stryke.data.record.id}" },
    endDate : { isn : null }
    }) {
        id
    }
}`;

stryke.find(queryForCheckedInLogs).then((result) => {
        
    const userRecord = stryke.data.record;

    if (result && result.length === 0) {
        // user not checked in
        console.error(userRecord.firstname + ' is not checked in!');
        stryke.error(userRecord.firstname + ' is not checked in!');
    }
    else if (result.length === 1) {
        // edit the active log
        const currentTime = new Date;
        const updateData = { endDate : currentTime.toISOString() };
        const logId = result[0].id;
        stryke.update(logId, updateData).then((responseData) => {            
            console.log('Log updated. End date: ' + responseData.endDate);
            stryke.resolve(userRecord.firstname + ' checked out!');
        }).catch((err) => {
            console.log('failed to update log record for check out: '+ err.message);
            stryke.error('Check out failed! ' + + err.message);
        });
    }
    else {            
        // user has more than one open log! error!
        stryke.error(firstname.name + ' has many opened log entries. Contact your administrator!');        
    }     
}).catch((err) => {
    console.error('Check out failed: ' + err.message);
    stryke.error('Check out failed!');
});
