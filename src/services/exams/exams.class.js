const { Service } = require('feathers-mongodb');
var apps = '';
exports.Exams = class Exams extends Service {
  constructor(options, app) {
    super(options);
    
    app.get('mongoClient').then(db => {
      this.Model = db.collection('exams');
    });
    apps = app;
  }
  async find(params){
    var exams = await super.find(params);

    return Promise.resolve(exams);
  }
  async create(data, params){
    var response = '';
    var check = true;
    var arr = [];
    var req = ['exam', 'type', 'school', 'dept', 'level', 'report', 'lecturer'];
    req.forEach(fd => {
        if(Object.keys(data).includes(fd)){
            
        }
        else{
            check = false;
            console.log(fd, 'missing');
            arr.push(fd);
        }
    });
    var exams = await apps.service('exams').find(params);
    // exams = exams.data;
    
    if(Object.keys(data).length >= 1){
      if(check){
        
        if(exams.length >= 1){
          response = 'Exam Created';
        }
        else{
          response =  "First Exam";
          
        }
        
        if(response == 'Exam Created' || response == 'First Exam'){
          data['students'] =  [];
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
    var response = 'Not allowed';
    return Promise.resolve(response);
  }
  async patch(id, data, params){
    var response = await super.patch(id, data, params);
    return Promise.resolve(response);
  }
  async get(id, params){
    var response = await super.get(id, params);
    return Promise.resolve(response);
  }
  async remove(id, params){
    var response = await super.remove(id, params);
    return Promise.resolve(response);
  }
};
