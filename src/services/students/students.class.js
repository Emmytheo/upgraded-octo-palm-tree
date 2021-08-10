const { query, response } = require('@feathersjs/express');
const { Service } = require('feathers-mongodb');

var apps = '';
exports.Students = class Students extends Service {
  constructor(options, app) {
    super(options);
    
    app.get('mongoClient').then(db => {
      this.Model = db.collection('students');
    });
    apps = app;

  }
  
  async find(params){
    var students = await super.find(params);

    return Promise.resolve(students);
  }
  async create(data, params){
    var response = '';
    var check = true;
    var arr = [];
    var req = ['name', 'level', 'school', 'dept', 'reg'];
    req.forEach(fd => {
        if(Object.keys(data).includes(fd)){
            
        }
        else{
            check = false;
            console.log(fd, 'missing');
            arr.push(fd);
        }
    });
    var students = await apps.service('students').find(params);
    // students = students.data;
    
    if(Object.keys(data).length >= 1){
      if(check){
        if(students.length >= 1){
          console.log('Right', students);
          students.forEach(student => {
            
            if(data.reg !== undefined){
              console.log(student.reg, data.reg);
              if(student.reg == data.reg){
                response = 'User already Exists';
                
              }
              else{
                response = 'User Registered';
              }
            }
            else{
              if(data.reg == undefined){
                response = 'Reg No is required';
              }
              
            }
            
            
          });
        }
        else{
          
          response =  "First Registration";
          
        }
        
        if(response == 'User Registered' || response == 'First Registration'){
          super.create(data, params);
        }
        
      }
      else{
        response = {
          'Values Missing': arr
        }
      }
      return Promise.resolve(response);
    }
    else{
      return Promise.resolve('Not allowed');
    }
    
  }
  async update(id, data, params){
    var response = '';
    switch(id){
      case 'single': {
        var student = await apps.service('students').get(data[0].reg);
        super.patch(student._id, data[0], params);
        response = 'Data Updated';
        
        break;
      }
      case 'multi': {

        break;
      }
      default: {

          break;
      }
    }
    

    return Promise.resolve(response);
  }
  async patch(id, data, params){
    return Promise.resolve('Not allowed');
  }
  async get(id, params){
    var response = '';
    var count = 0;
    if(typeof(id) == String){
      var student = await apps.service('students').find(params, {
        query: {
          reg: id,
        }
      });
      response = student[0];
    }
    else{
      // console.log(response);
      if(Object.keys(id).includes('type')){
        if(id.type.toLowerCase() == 'random'){
          var studs = await apps.service('students').find(params);
          var mn = 0;
          var mx = studs.length;
          var stud = '';
          if(id.pastStuds.length < studs.length){
            do{
              stud = studs[Math.floor((Math.random() * (mx - mn) + mn) - mn)];
              count++;
              console.log(count);
              console.log(id.pastStuds);
              
            }while(id.pastStuds.includes(parseInt(stud.reg)));
            console.log(stud.reg);
            response = stud;
          }
          else{
            response = "Max amount of students reached";
          }
          
        }
      }
      else{
        response = [];
        var students = await apps.service('students').find(params);
        students.forEach(student => {
          if(id.includes(parseInt(student.reg))){
            response.push(student);
          }
          else{
            // console.log(student, id.includes(student.reg), id);
          }
        });
        
        
      }
      
    }
    
    return Promise.resolve(response);
  }
  async remove(id, params){
    var response = await super.remove(id, params);
    return Promise.resolve(response);
  }

};

