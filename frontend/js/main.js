let status = 'in';
const lastLogLocalStorageName = 'lastLog';

// check if the user is logged in. Else show login form...
checkAuth();
loadView();

async function loadView() {
  
  $('#task').change(updateLastLog);
  $('#project').change(updateLastLog);
  
  await loadTasks();
  await loadProjects();
  
  const userStatus = await loadUserStatus();
  status = userStatus.status;
  
  if (userStatus.status === 'in') {
    // set color of status
    $('#status').css('color','green');
    $('#status').text('checked in');
    // set color and text of button
    $('#actionBtn').css('background-color','red');
    $('#actionBtn').css('color','white');
    $('#actionBtn').text('Check out');
    // set time worked
    // show or hide last log
    $('#lastLog').hide();
  }
  else {
    // set color of status
    $('#status').css('color','red');
    $('#status').text('checked out');
    // set color and text of button
    $('#actionBtn').css('background-color','green');
    $('#actionBtn').css('color','white');
    $('#actionBtn').text('Check in');    
    loadLastLogView()
    
  }
}

async function updateLastLog() {
  const lastLog = JSON.parse(localStorage.getItem(lastLogLocalStorageName));        
  if (lastLog) {
    
    const taskVal = $('#task').val();
    lastLog.task = taskVal && taskVal !== 'none' ? taskVal : null;
    const projectVal = $('#project').val();
    lastLog.project = projectVal && projectVal !== 'none' ? projectVal : null;
    
    const updateData = {
      task: lastLog.task,
      project: lastLog.project,
    }
    
    try {
      const response = await strykePut('data', lastLog.id, updateData);  
      localStorage.setItem(lastLogLocalStorageName, JSON.stringify(lastLog));
    }
    catch(err) {
      const message = err.response.data ? err.response.data.message : err.message;
      console.log('Failed to update task. ' + message);        
    }     
  }
}

function loadLastLogView() {
  
  // show or hide last log
  const lastLog = JSON.parse(localStorage.getItem(lastLogLocalStorageName));        
  if (lastLog) {
    $('#lastLog').show();

    // set "your last log" data
    const startDate = moment(lastLog.startDate);
    const endDate = moment(lastLog.endDate);    
    const duration = moment.duration(endDate.diff(startDate));
    const formatted = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
    $('#lastLogStart').text(startDate.format('DD MMM HH:mm:ss'));
    $('#lastLogEnd').text(endDate.format('DD MMM HH:mm:ss'));      
    $('#lastLogDuration').text(formatted);

    // select right task and project
    const taskId = userStatus.activeLog.task.id ? userStatus.activeLog.task.id : 'none';
    $('#task').val(taskId);
    const projectId = userStatus.activeLog.project.id ? userStatus.activeLog.project.id : 'none';
    $('#project').val(projectId);
  }
}

$("#logout").on('click', async () => {    
  strykeLogout();
  localStorage.removeItem(lastLogLocalStorageName); 
  window.location.href = '/login.html';
});

$("#actionBtn").click(async () => { 
  
  if (status === 'in') {
    checkOut();
    status = 'out';    
  }
  else {
    checkIn();
    status = 'in';
  }
  
  loadView();
});

async function checkIn() {
  try {
    const response = await strykePost('action/checkInApi');        
    return response.data.data;   
  }
  catch(err) {
    const message = err.response.data ? err.response.data.message : err.message;
    console.log('Failed to check user in. ' + message);  
    if (err.response.status === 401) {
      window.location.href = '/login.html';
    }
  }   
}

async function checkOut() {
  try {
    const response = await strykePost('action/checkOutApi'); 
    localStorage.setItem(lastLogLocalStorageName, JSON.stringify(response.data.data));        
  }
  catch(err) {
    console.log('Failed to check user out. ' + err.message); 
    if (err.response.status === 401) {
      window.location.href = '/login.html';
    }
  }   
}

async function loadUserStatus() {
  try {
    const response = await strykePost('action/getUserStatus');   
    if (response.data.data.activeLog) {
      localStorage.setItem(lastLogLocalStorageName, JSON.stringify(response.data.data.activeLog)); 
    }
    return response.data.data;   
  }
  catch(err) {
    console.log('failed to load user status. ' + err.message);   
    if (err.response.status === 401) {
      window.location.href = '/login.html';
    }
  }   
  
}

async function loadTasks() {
  try {
    // reset content
    $('#task').find('option').remove();
    $('#task').append(`<option value="none">none</option>`);
    const response = await strykeGet('data?entityType=task');    
    if (response && response.data && response.data.data && response.data.data.dataRecords) {
       for (const task of response.data.data.dataRecords) {
         $('#task').append(`<option value="${task.id}">${task.alias}</option>`);
       }; 
    }    
  }
  catch(err) {
    console.log('failed to load types. ' + err.message);    
  }   
}

async function loadProjects() {
  try {
    // reset content
    $('#project').find('option').remove();
    $('#project').append(`<option value="none">none</option>`);
    const response = await strykeGet('data?entityType=project');    
    if (response && response.data && response.data.data && response.data.data.dataRecords) {
       for (const project of response.data.data.dataRecords) {
         $('#project').append(`<option value="${project.id}">${project.alias}</option>`);
       }; 
    }    
  }
  catch(err) {
    console.log('failed to load businesses. ' + err.message);    
  }   
}