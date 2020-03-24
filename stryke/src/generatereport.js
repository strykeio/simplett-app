/**
 * Retrieves all log records for the logged in user in the time period specified by the start and end fields of
 * the report record from which this action is called. 
 * 
 * The response of this action is styled using the reportTemplate.html template.
 */
const moment = require('moment');

// Classes defining the structure of the return object
class ReportResult {
    constructor(totalAttendanceInMinutes, logs, firstname, lastname, startdate, enddate) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.startdate = startdate;
        this.enddate = enddate;
        
        this.totalAttendanceInMinutes = totalAttendanceInMinutes;        
        this.logs = logs;
    }
}

class Attendance {
    constructor(starttime, endtime, attendanceInMinutes, project, task) {
        this.starttime = starttime;
        this.endtime = endtime;
        this.attendanceInMinutes = attendanceInMinutes;      
        this.project = project;
        this.task = task;  
    }
}

// main function that generates the report
async function generateReport() {
    const reportStart = stryke.data.record.startdate;
    const reportEnd = stryke.data.record.enddate;
    
    const userInfo = await getUserInfo();

    try {
        console.log('report start date: ' + reportStart);
        console.log('report end date: ' + reportEnd);
        const allLogsForCurrentMonthQuery = `{  
            Log (filter : {
                startDate : { gt : "${reportStart}", 
                            lt : "${reportEnd}"},
            userinfo : { eq : "${userInfo.id}" }
            }) {
                id
                startDate
                endDate
                project {
                    alias
                    name
                }
                task {
                    alias
                    name
                }
                userinfo {
                    firstname,
                    lastname
                }
            }
        }`;
    
        const logRecords = await stryke.find(allLogsForCurrentMonthQuery);
                         
        const reportData = calculateReportData(logRecords);

        reportData.firstname = userInfo.firstname;
        reportData.lastname = userInfo.lastname;
        reportData.startdate = formatDateTime(reportStart);
        reportData.enddate = formatDateTime(reportEnd);
        
        stryke.resolve(reportData);        
    }
    catch (err) {
        console.error(`Failed to calculate monthly report: ${err.message}`);
        stryke.error('Failed to calculate monthly report');
    }
}

async function getUserInfo() {
    
    try {                                    
        const userInfo = await stryke.findOne(`{ Userinfo (filter : {                                    
            user :{ eq: "${stryke.user.id}" }
            }) {
                id, firstname, lastname
            }
        }`);         
        return userInfo;
    }
    catch (err) {
        console.error('error: ' + err.message);
        stryke.error(`Failed to retrieve the user's details`);
    }  
}

function calculateReportData(logsArray) {
    let totalAttendance = 0;
    let attendances = [];
    for (let log of logsArray) {                       
                                
        const duration = moment(log.endDate).diff(moment(log.startDate), 'seconds');        
        const project = log.project ? log.project.alias : '';
        const task = log.task ? log.task.alias : '';
        attendances.push(new Attendance(formatDateTime(log.startDate), 
                                        formatDateTime(log.endDate), 
                                        formatSeconds(duration), 
                                        project, 
                                        task));
        totalAttendance += duration;                  
    } 
   
    return new ReportResult(formatSeconds(totalAttendance), attendances);
}

function formatDateTime(dt) {
    return moment(dt).format('YYYY-MM-DD HH:mm:ss')    
}

function formatSeconds(seconds) {
    // date does not matter, we just want start of day
    return moment("2020-01-01").startOf('day').seconds(seconds).format('HH:mm:ss');    
}

generateReport();