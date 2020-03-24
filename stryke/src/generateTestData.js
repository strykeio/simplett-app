/**
 * A data generation script. Note that this script does not have an action associated with it becasue
 * it is only meant for setup/testing. It will generate the required number of logs, with randomly generated data.
 *
 * Make sure to populate the tasks and projects arrays to ensure that your logs also have tasks and projects set
 */

// IMPORTANT: Populate these arrays with valid IDs from your app.
// eg: const TASKS_IDS = ['2899d939-24b1-4f81-83f3-538bcd3cb479', '6ee8e535-a7ed-4639-976e-3ccbc3fbe582', '4e6dfbf7-a8ec-4788-b3db-db544548227f'];
const TASKS_IDS = [];
const PROJECTS_IDS = [];
// IMPORTANT: set the ID of the user whose logs this script will create. eg: const USER_ID = '05ee879b-acc4-4cd1-9de2-8b3edde40b7b';
const USER_ID = '';

const NUM_OF_RECORDS_TO_CREATE = 18;
const YEAR = 2019;
const MONTH = 10;

if (USER_ID == '') {
    stryke.error('Fill in the user ID before running the data generation script.');
}

for (var i = 0; i < NUM_OF_RECORDS_TO_CREATE; i++) {    
    const startTimeAm = getRandomDateWithTime(YEAR, MONTH, 1+i, 0);
    const endTimeAm = getRandomDateWithTime(YEAR, MONTH, 1+i, 1);
    const taskAm = getRandomEntry(TASKS_IDS);
    const projAm = getRandomEntry(PROJECTS_IDS);
    createLog(USER_ID, startTimeAm, endTimeAm, taskAm, projAm);

    const startTimePm = getRandomDateWithTime(YEAR, MONTH, 1+i, 2);
    const endTimePm = getRandomDateWithTime(YEAR, MONTH, 1+i, 3);
    const taskPm = getRandomEntry(TASKS_IDS);
    const projPm = getRandomEntry(PROJECTS_IDS);
    createLog(USER_ID, startTimePm, endTimePm, taskPm, projPm);
}

stryke.resolve('Data created');

async function createLog(userInfoId, startDate, endDate, task, project) {

    const newLog = { 
        userinfo: userInfoId, 
        startDate, 
        endDate,
        task, 
        project
    };
    
    try {        
        const result = await stryke.create('log', newLog);        
    }
    catch (err) {
        console.log('failed to create log record: '+ err.message);
        stryke.error('Failed creating data!');
    }    
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomDateWithTime(year, month, day, partOfDay) {
    const morningStartDateBeginRange = new Date(year, month, day, 8, 0);
    const morningStartDateEndRange = new Date(year, month, day, 10, 0);
    const morningEndDateBeginRange = new Date(year, month, day, 12, 0);
    const morningEndDateEndRange = new Date(year, month, day, 14, 0);
    const afternoonStartDateBeginRange = new Date(year, month, day, 14, 0);
    const afternoonStartDateEndRange = new Date(year, month, day, 14, 30);
    const afternoonEndDateBeginRange = new Date(year, month, day, 18, 0);
    const afternoonEndDateEndRange = new Date(year, month, day, 19, 0);

    switch (partOfDay) {
        case 0:
            // morning start
            return randomDate(morningStartDateBeginRange, morningStartDateEndRange);
        case 1:
            // morning end
            return randomDate(morningEndDateBeginRange, morningEndDateEndRange);
        case 2:
            // afternoon start
            return randomDate(afternoonStartDateBeginRange, afternoonStartDateEndRange);
        case 3:
            // afternoon end
            return randomDate(afternoonEndDateBeginRange, afternoonEndDateEndRange);

    }
}

function getRandomEntry(array) {
    return array[Math.floor(Math.random() * array.length)]
}