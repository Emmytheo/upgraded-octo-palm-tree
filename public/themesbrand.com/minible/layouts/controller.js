// Establish a Socket.io connection



const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();
var regs = document.getElementsByClassName('regs');
var user = '';
var count = 0;
var lec_id = '';
var note = document.getElementById('note');
var res = '';
var att_name = document.getElementById('att_name');
var acc_data = '';
var lecturearea = document.getElementById('lectures');
var status = 0;
var authButton = document.getElementById('authButton');
var foundCard = document.getElementById('foundCard');
var pyt = document.getElementById('placeyourthumb');
var loader = document.getElementById('loader');
var page = window.location.href.split('/')[window.location.href.split('/').length - 1].split('.')[0];
var timer = '';
var stuName = document.getElementById('stuName');
var stuReg = document.getElementById('stuReg');
var stuFaculty = document.getElementById('stuFaculty');
var stuDept = document.getElementById('stuDept');
var stuLevel = document.getElementById('stuLevel');


console.log(page);


client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication());

const getCredentials = () => {
    var user = {};
    if(page.indexOf('login') !== -1){
        user = {
            email: document.getElementById('useremail').value,
            password: document.getElementById('userpassword').value,
        };
    }
    else if(page.indexOf('ecommerce-add-product') !== -1){
        if(page.split('-').includes('product')){
            user = {
                name: document.getElementById('name').value || 'Sample Student',
                level: document.getElementById('level').value,
                school: document.getElementById('school').value,
                dept: document.getElementById('dept').value,
                reg: document.getElementById('reg').value || 2010000007,
            };
        }
        else if(page.split('-').includes('product2')){
            user = {
                lecture: document.getElementById('lecture').value || 'Sample Lecture',
                type: document.getElementById('type').value,
                school: document.getElementById('school').value,
                dept: document.getElementById('dept').value,
                level: document.getElementById('level').value,
                report:document.getElementById('report').value,
                lecturer: document.getElementById('lecturer').value || 'Sample Lecturer',
                
            };
        }
        
    }
    else if(page.indexOf('contacts') !== -1){
        
    }
    else{
        user = {
            email: document.getElementById('useremail').value,
            password: document.getElementById('userpassword').value,
            name: document.getElementById('username').value,
        };
    }
    
    return user;
};

// Log in either using the given email/password or the token from storage
const login = async credentials => {
    try {
      if(!credentials) {
        // Try to authenticate using an existing token
        await client.reAuthenticate();
      } else {
        // Otherwise log in with the `local` strategy using the credentials we got
        await client.authenticate({
          strategy: 'local',
          ...credentials
        });
        
      }
      user = await client.authenticate();
      console.log(user.user._id);
      clearInterval(timer)
      timer = setInterval(function(){ showProgress('note', 'login') }, 1000);
  
      // If successful, show the chat page
    //   showChat();
    } catch(error) {
      // If we got an error, show the login page
    //   showLogin(error);
        
        switch(error.name){
            case 'NotAuthenticated': {
                if(note !== null){
                    note.innerHTML = error;
                }
                else{
                    console.log('Here now');
                    window.location.assign("auth-login.html");
                }
                
                
                
                break;
            }
            default:{
                
                break;
            }
            
        }
        // console.log(error);
    }
    
};

const addEventListener = (selector, event, handler) => {
    document.addEventListener(event, async ev => {
      if (ev.target.closest(selector)) {
        handler(ev);
      }
    });
};
  
  // "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
    // For signup, create a new user and then log them in
    const credentials = getCredentials();
      
    // First create the user
    await client.service('users').create(credentials);
    // If successful log them in
    await login(credentials);
    // user = credentials;

});
  
  // "Login" button click handler
addEventListener('#login', 'click', async () => {
    const user = getCredentials();
    console.log(user);
    await login(user);
    
    // timer = setInterval(function(){ showProgress('note', 'login') }, 1000);
    
    
});
  

  // "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout();
  window.location.assign('index.html')
});
addEventListener('#addstudent', 'click', async () => {
    const stud = getCredentials();
    var check = true;
    var err = [];
    Object.keys(stud).forEach(st => {
        if(stud[st] == '' || stud[st] == 'Select'){
            switch(st){
                case 'level': {
                    stud[st] = 500
                    break;
                }
                case 'dept': {
                    stud[st] = 'CSC'
                    break;
                }
                case 'school': {
                    stud[st] = 'SCIT'
                    break;
                }
                default: {
                    err.push(st);
                    check = false;
                    break
                }
            }
            
            
        }
    })
    
    

    if(check){
        res = await client.service('students').create(stud);
        alert(res);
        console.log(res);
        
    }
    else{
        err.forEach(er => {
            if(er == ''){
                er = null;
            }
            var t = er + 'is missing'
            alert(t);
            console.log(er, 'is missing')
        })
    }
    
    
    // window.location.assign('index')
});
addEventListener('#addlecture', 'click', async () => {
    const stud = getCredentials();
    var check = true;
    var err = [];
    Object.keys(stud).forEach(st => {
        if(stud[st] == '' || stud[st] == 'Select'){

            switch(st){
                case 'level': {
                    stud[st] = 500
                    break;
                }
                case 'dept': {
                    stud[st] = 'CSC'
                    break;
                }
                case 'school': {
                    stud[st] = 'SCIT'
                    break;
                }
                case 'type': {

                    stud[st] = 'Lecture'
                    break;
                }
                case 'report': {
                    stud[st] = 'PDF'
                    break;
                }
                default: {
                    err.push(st);
                    check = false;
                    break
                }
            }
            
            
        }
    })
    
    

    if(check){
        if(stud.type == 'Examination'){
            if(stud.lecture == 'Sample Lecture'){
                stud['exam'] = 'Sample Exam';
            }
            else{
                stud['exam'] = stud.lecture;
            }
            
            delete stud.lecture;
            res = await client.service('exams').create(stud);
            alert(res);
            console.log(res);
        }
        else{
            res = await client.service('lectures').create(stud);
            alert(res);
            console.log(res);
        }
        
        
    }
    else{
        err.forEach(er => {
            if(er == ''){
                er = null;
            }
            var y = er + 'is missing'
            alert(y);
            console.log(er, 'is missing')
        })
    }
    
    
    // window.location.assign('index')
});


var showProgress = function(element, type){
    if(type == 'login'){
        evnts = [
            "Fetching Data.....",
            "Data Fetch Complete",
            "Setting up the Dashboard..."
        ];
        if(page.split(".")[0].indexOf('login') !== -1){
            document.getElementById(element).innerHTML = evnts[count];
            if(count >= evnts.length){
                clearInterval(timer);
                window.location.assign('layouts-hori-topbar-dark.html')
                
            }
        }
        else{
            console.log(evnts[count])
            clearInterval(timer);
        }
        count++;
        
        
    }
    
}
if(page == 'index' || page == ''){
    console.log('arf');
}
else if(page == 'auth-login'){

}
else{
    login()
}

if(page.indexOf('login') !== -1){

}
else if(page.indexOf('register') !== -1){

}
else if(page.indexOf('lockscreen') !== -1){

}
else if(page.indexOf('layouts-hori-topbar-dark') !== -1){

}
else if(page.indexOf('ecommerce-add-product2') !== -1){

}

else if(page.indexOf('ecommerce-products') !== -1){
    client.service('students').find().then(sttt => {
        console.log(loadcards('profile','profileCard', sttt))
        console.log(sttt.length);

    })
}
else if(page.indexOf('contacts-grid') !== -1){
    if(page.split('-').includes('grid')){
        client.service('exams').find().then(lec => {
            console.log(loadcards('exams','gridcard', lec))
            // console.log(lec.length);

        })
    }
    else if(page.split('-').includes('grid2')){
        client.service('lectures').find().then(lec => {
            console.log(loadcards('lectures','gridcard', lec))
            // console.log(lec.length);

        })
    }
}

else if(page.indexOf('contacts-list') !== -1){
    if(page.split('-').includes('list')){
        lec_id = window.sessionStorage.getItem('currID');
        var studs = [];
        var stude = '';
        console.log(lec_id);
        if(lec_id){
            client.service('exams').get(lec_id).then(lec =>{
                [...new Set(lec.students)].forEach(e=>{studs.push(parseInt(e))});
                console.log(studs);
                if(lec.lecture == undefined){
                    att_name.innerText = 'Showing Attendance for ' + lec.exam + ' by ' + lec.lecturer;
                }
                else{
                    att_name.innerText = 'Showing Attendance for ' + lec.lecture + ' by ' + lec.lecturer;
                }
                
                if(lec.students == undefined || lec.students == []){

                    client.service('exams').patch(lec_id, {'students' : []}).then( res =>
                        {
                            console.log('No Students for this Exam yet');
                            console.log('Click Add new to start adding Students');
                            var att = document.getElementById('attendance').children[0];
                            att.innerHTML = `<td>Click Add new to start adding Students</td>`;
                        }
                    )
                    
                }
                else{
                    client.service('students').get(studs).then(stud => {
                        console.log(stud);
                        console.log(loadcards('attendance','AttendanceCard', stud))
                    })
                }
                

            })
        }
        else{
            window.location.assign('contacts-grid.html')
        }
    }
    else if(page.split('-').includes('list2')){
        lec_id = window.sessionStorage.getItem('currID');
        var studs = [];
        var stude = '';
        console.log(lec_id);
        if(lec_id){
            client.service('lectures').get(lec_id).then(lec =>{
                [...new Set(lec.students)].forEach(e=>{studs.push(parseInt(e))});
                console.log(studs);
                att_name.innerText = 'Showing Attendance for ' + lec.lecture + ' by ' + lec.lecturer;
                if(lec.students == undefined || lec.students == []){

                    client.service('lectures').patch(lec_id, {'students' : []}).then( res =>
                        {
                            console.log('No Students for this lecture yet');
                            console.log('Click Add new to start adding Students');
                            var att = document.getElementById('attendance').children[0];
                            att.innerHTML = `<td>Click Add new to start adding Students</td>`;
                        }
                    )
                    
                }
                else{
                    client.service('students').get(lec.students).then(stud => {
                        console.log(loadcards('attendance','AttendanceCard', stud))
                    })
                }
                

            })
        }
        else{
            window.location.assign('contacts-grid2.html')
        }
    }
}

var loadcards = function(container, card, data){
    container = document.getElementById(container);
    var row = '';
    var col = '';
    var html = '';
    var res = '';
    switch(card){
        case 'gridcard': {
            var lecture = '';
            var lectureid = '';
            row = {
                'begin': `<div class="row">`,
                'end' : `</div>`
            };
            col = {
                'begin': `<div class="col-xl-3 col-sm-6">`,
                'end' : `</div>`
            }
            card = {
                'start' : `<div onclick="lecture('`,
                'body': `')" class="card text-center">
                <div class="card-body">
                    <div class="dropdown float-end">
                        <a class="text-body dropdown-toggle font-size-16" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                          <i class="uil uil-ellipsis-h"></i>
                        </a>
                      
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="contacts-list2.html">Edit</a>
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Remove</a>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="mb-4">
                        <!-- <img src="assets/images/users/avatar.svg" alt="" class="avatar-lg rounded-circle img-thumbnail"> -->
                        <i class="uil-book-open me-2 avatar-lg rounded-circle img-thumbnail" style="font-size:xx-large;"></i>
                    </div>
                    <h5 class="font-size-16 mb-1"><a href="#" class="text-dark">`
                ,
                'end' :`</a></h5>
                    
                    
                </div>

                <div class="btn-group" role="group">
                    <button type="button" onclick="classlist()" class="btn btn-outline-light text-truncate"><i class="uil uil-user me-1"></i>`,
                'footer': ` Students</button>
                <button type="button" onclick="report()" class="btn btn-outline-light text-truncate"><i class="uil uil-receipt me-1"></i> Generate Report</button>

            </div></div>`

            }
            var cols = 4;
            var id = 0;
            var stuu = 0;
            var rows = parseInt(data.length / 4)
            var rem = data.length % 4
            for (i = 1; i <= rows; i++){
                //row begin
                html += row.begin;
                for(j = 1; j <= cols; j++){
                    //col begin
                    html += col.begin;
                    id = (i*cols - (cols - j)) - 1;
                    if(data[id].students == undefined){
                        stuu = 0;
                    }
                    else{
                        stuu = data[id].students.length;
                    }
                    lecture = data[id].lecture;
                    if(lecture == undefined){
                        lecture = data[id].exam;
                    }
                    lectureid = data[id]._id;
                    console.log(lecture)
                    html += card.start;
                    html += lectureid;
                    html += card.body;
                    html += lecture;
                    html += card.end;
                    html += stuu;
                    html += card.footer;
                    // col end
                    html += col.end;
                }
                //row end
                html += row.end;
            }
            if(rem !== 0){
                //row begin
                html += row.begin;
                for(k = 0; k < rem; k++){
                    //col begin
                    html += col.begin;
                    
                    id +=  1;
                    if(data[id].students == undefined){
                        stuu = 0;
                    }
                    else{
                        stuu = data[id].students.length;
                    }
                    lecture = data[id].lecture;
                    if(lecture == undefined){
                        lecture = data[id].exam;
                    }
                    lectureid = data[id]._id;
                    html += card.start;
                    html += lectureid;
                    html += card.body;
                    html += lecture;
                    html += card.end;
                    html += stuu;
                    html += card.footer;
                    // col end
                    html += col.end;
                    
                }
                //row end
                html += row.end;
            }
            container.innerHTML = html;
            console.log(data);
            if(data == [] || data[id] == undefined){

            }
            else{
                if(data[id].lecture == undefined){
                    res = 'Rendered ' + data.length + ' Exam Records';
                    alert(res);
                }
                else{
                    res = 'Rendered ' + data.length + ' Lecture Records';
                    alert(res);
                }
            }
            
            
            // res = html;
            



            break;
        }
        case 'AttendanceCard': {
            var student = '';
            row = {
                'begin': `<tr>`,
                'end' : `</tr>`
            };
            head = `<th scope="row"><div class="form-check font-size-16"><input type="checkbox" class="form-check-input" id="contacusercheck1"><label class="form-check-label" for="contacusercheck1"></label></div></th>`
            tail = `<td><ul class="list-inline mb-0"><li class="list-inline-item"><a href="javascript:void(0);" class="px-2 text-primary"><i class="uil uil-pen font-size-18"></i></a></li><li class="list-inline-item"><a href="javascript:void(0);" class="px-2 text-danger"><i class="uil uil-trash-alt font-size-18"></i></a></li><li class="list-inline-item dropdown"><a class="text-muted dropdown-toggle font-size-18 px-2" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true"><i class="uil uil-ellipsis-v"></i></a><div class="dropdown-menu dropdown-menu-end"><a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another action</a><a class="dropdown-item" href="#">Something else here</a></div></li></ul></td>`
            col = {
                'begin': `<td>`,
                'end' : `</td>`
            }
            card = [
                head,
                {
                    'begin' : `<td><img src="assets/images/users/avatar.svg" alt="" class="avatar-xs rounded-circle me-2"><a href="#" class="text-body">`,
                    'end' : `</a></td>`
                },
                {
                    'begin' :  `<td class='regs'>`,
                    'end' : col.end 
                },
                {
                    'begin' :  col.begin,
                    'end' : col.end
                },
                tail
            ]
            var cols = 5;
            var id = 0;
            var rows = data.length
            for (i = 0; i < rows; i++){
                //row begin
                html += row.begin;
                for(j = 0; j < cols; j++){
                    // console.log(card[j]);
                    //col begin
                    if(typeof(card[j]) == 'object'){
                        html += card[j].begin
                        switch(j.toString()){
                            case '1': {
                                
                                html += data[i].name;
                                console.log(data[i].name)
                                break;
                            }
                            case '2': {
                                html += data[i].reg;
                                console.log(data[i].reg)
                                break;
                            }
                            case '3': {
                                html += data[i].school + ' - ' +  data[i].dept + ' - ' + data[i].level;
                                console.log(data[i].school + ' - ' +  data[i].dept + ' - ' + data[i].level)
                                break;
                            }
                            default: {
                                // console.log(j);
                                break;
                            }
                        }
                        html += card[j].end
                    }
                    else{
                        html += card[j];
                        // console.log('hererrrrrerre')
                    }
                    // col end
                    html += col.end;
                }
                //row end
                html += row.end;
            }
            
            container.innerHTML = html;


            res = 'Rendered ' + data.length + ' Attendance Records';
            

            break;
        }
        case 'profileCard': {
            var studentname = '';
            var reg = '';
            var lev_sch_dept = '';
            row = {
                'begin': `<div class="row">`,
                'end' : `</div>`
            };
            
            
            col = {
                'begin': `<div class="col-xl-4 col-sm-6">`,
                'end' : `</div>`
            }
            card = {
                'start' : `<div class="product-box" onclick="student('`,
                'body': `')" >
                <div class="product-img pt-4 px-4">
                    <!-- <div class="product-ribbon badge bg-primary">
                        Course Rep
                    </div> -->
                    <h5><div class="product-wishlist">
                        <a href="contacts-profile.html">
                            <i class="mdi mdi-menu"></i>
                        </a>
                    </div></h5>
                    <br>
                    
                    <img src="assets/images/users/avatar.svg" width="80%" alt="" class=" rounded-circle img-fluid mx-auto d-block">
                    <br><br>
                </div>
               
                <div class="text-center product-content p-4">
                    
                    <h5 class="mb-1"><a href="#" class="text-dark">`,
                'end' :`</a></h5>
                <p class="text-muted font-size-13">`,
                'foot': `</p><h5 class="mt-3 mb-0 text-muted me-2">`,
                'footer': `</h5>
                                                                
                <!-- <ul class="list-inline mb-0 text-muted product-color">
                    <li class="list-inline-item">
                        Skills :
                    </li>
                    <li class="list-inline-item">
                        Leadership, 
                    </li>
                    <li class="list-inline-item">
                        Politics
                    </li>
                </ul> --></div></div>`

            }
            var cols = 3;
            var id = 0;
            var stuu = 0;
            var rows = parseInt(data.length / 3)
            var rem = data.length % 3
            for (i = 1; i <= rows; i++){
                //row begin
                html += row.begin;
                for(j = 1; j <= cols; j++){
                    //col begin
                    html += col.begin;
                    id = (i*cols - (cols - j)) - 1;
                    //get student data
                    studentname = data[id].name;
                    reg = data[id].reg;
                    lev_sch_dept = data[i].school + ' - ' +  data[i].dept + ' - ' + data[i].level;
                    //load into html buffer
                    html += card.start;
                    html += reg;
                    html += card.body;
                    html += studentname;
                    html += card.end;
                    html += reg;
                    html += card.foot;
                    html += lev_sch_dept;
                    html += card.footer;
                    // col end
                    html += col.end;
                }
                //row end
                html += row.end;
            }
            if(rem !== 0){
                //row begin
                html += row.begin;
                for(k = 0; k < rem; k++){
                    //col begin
                    html += col.begin;
                    id +=  1;
                    //get student data
                    console.log(data[id]);
                    studentname = data[id].name;
                    reg = data[id].reg;
                    lev_sch_dept = data[id].school + ' - ' +  data[id].dept + ' - ' + data[id].level;
                    //load into html buffer
                    html += card.start;
                    html += reg;
                    html += card.body;
                    html += studentname;
                    html += card.end;
                    html += reg;
                    html += card.foot;
                    html += lev_sch_dept;
                    html += card.footer;
                    // col end
                    html += col.end;
                    
                }
                //row end
                html += row.end;
            }
            container.innerHTML = html;
            res = 'Rendered ' + data.length + ' Student Records';
            alert(res);
            
            
            // res = html;
            



            break;
        }
        case '': {

            break;
        }
        default: {

            break;
        }
    }
    
    return res;

}

var lecture = function(id){
    console.log(id.toString());
    window.sessionStorage.setItem('currID', id.toString());

    if(page.indexOf('contacts-grid') !== -1){
        if(page.split('-').includes('grid')){
            window.location.assign('contacts-list.html')
        }
        else if(page.split('-').includes('grid2')){
            window.location.assign('contacts-list2.html')
        }
    }
}
var student = function(id){
    console.log(id.toString());
    window.sessionStorage.setItem('stuID', id.toString());

    
}

var deletecard = function(type, id){
    switch(type){
        case 'students' = {
          if(typeof(id) == String){
            client.service('students').get(id).then(st => {
              client.service('students').remove(st[0]._id).then(ans => {
                 alert("Student " + id + " removed");
                 client.service('students').find().then(sttt => {
                    console.log(loadcards('profile','profileCard', sttt))
                    console.log(sttt.length);

                 })
              });
            });
          }
          else if(Array.isArray(id)){
            id.forEach(stude => {
              stude = stude.toString();
              client.service('students').get(stude).then(st => {
                client.service('students').remove(st[0]._id)
              });
            });
            alert("Students " + id + " removed");
          }
          else{
          }
          break;
        }
        case 'lectures' = {
          client.service('lectures').get(id).then( lc => {
            alert(lc[0].lecture + " By " + lc[0].lecturer + " Removed");
            client.service('lectures').remove(id).then( k => {
              client.service('lectures').find().then(lec => {
                console.log(loadcards('lectures','gridcard', lec))
              });
            });
            
          });
          break;
        }
        case 'exams' = {
          client.service('exams').get(id).then( ex => {
            alert(ex[0].exam + " By " + ex[0].lecturer + " Removed");
            client.service('exams').remove(id)..then( k => {
              client.service('exams').find().then(lec => {
                console.log(loadcards('exams','gridcard', lec));
              });
            });
          });
          
          break;
        }
        default = {
          //
          break;
        }
    }

}

var clst = [];
var authenticate = function(){
    
    var states = [ 'Scan', 'save'];
    if(status > 2){
        status = 0;
        pyt.innerHTML = 'Add another Student';  
        authButton.innerHTML = 'Add New';
        loader.style.display = 'block';
        
    }
    else{
        authButton.innerHTML = states[status];
        
        switch(status){
            case '0' : {
                pyt.innerHTML = 'Scanning...';  
                authButton.innerHTML = 'Please Wait';
                clst = [];
                regs.forEach( reg => {if(reg !== undefined){clst.push(parseInt(reg.innerText))}});
                // console.log(clst);
                //randomly select student
                client.service('students').get({'type': 'random', 'pastStuds': clst}).then( stu => {
                    if(typeof(stu) == 'object'){
                        stuName.innerText = stu.name;
                        stuReg.innerText = stu.reg;
                        stuFaculty.innerText = stu.school;
                        stuDept.innerText = stu.dept;
                        stuLevel.innerText = stu.level;
                        if(page.indexOf('contacts-list') !== -1){
                            if(page.split('-').includes('list')){
                                client.service('exams').get(lec_id).then( res => {
                                    var restu = res.students;
                                    var constu = [];
                                    restu.push(stu.reg);
                                    [...new Set(restu)].forEach(e=>{constu.push(parseInt(e))});
                                    restu = constu;
                                    console.log(restu)
                                    client.service('exams').patch(lec_id, {'students' : restu }).then( re => {
                                        client.service('students').get(restu).then(stud => {
                                            console.log(loadcards('attendance','AttendanceCard', stud))
                                        })
                                    })
                                });
                                timer = setTimeout(function () {
                                    pyt.innerHTML = 'Found Student';  
                                    loader.style.display = 'none';
                                    foundCard.style.display = 'block';
                                    authButton.innerHTML = 'continue';
                                }, 1000);
                            }
                            else if(page.split('-').includes('list2')){
                                client.service('lectures').get(lec_id).then( res => {
                                    var restu = res.students;
                                    var constu = [];
                                    restu.push(stu.reg);
                                    [...new Set(restu)].forEach(e=>{constu.push(parseInt(e))});
                                    restu = constu;
                                    client.service('lectures').patch(lec_id, {'students' : restu }).then( re => {
                                        client.service('students').get(restu).then(stud => {
                                            console.log(loadcards('attendance','AttendanceCard', stud))
                                        })
                                    })
                                });
                                timer = setTimeout(function () {
                                    pyt.innerHTML = 'Found Student';  
                                    loader.style.display = 'none';
                                    foundCard.style.display = 'block';
                                    authButton.innerHTML = 'continue';
                                }, 1000);
                            }
                        }
                        
                        
                        
                    }
                    else{
                        pyt.innerHTML = stu;  
                        console.log(typeof(stu));
                    }
                })
                
                break;
            }
            case '1' : {
                clearTimeout(timer);
                if(foundCard.style.display == 'none'){
                    status = 0;
                    window.location.assign(window.location.href);
                }
                break;
            }
            case '2' : {
                
                foundCard.style.display = 'none';
                authButton.innerHTML = 'Done';  
                pyt.innerHTML = 'Attendance List has been updated';  
                break;
            }
            
            default:{
                console.log(foundCard);
            }
        }
        status++;
    }
    
   
}
