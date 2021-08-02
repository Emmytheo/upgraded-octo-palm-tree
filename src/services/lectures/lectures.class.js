const { Service } = require('feathers-mongodb');
var apps = '';
exports.Lectures = class Lectures extends Service {
  constructor(options, app) {
    super(options);
    
    app.get('mongoClient').then(db => {
      this.Model = db.collection('lectures');
    });
    apps = app;
  }
  async find(params){
    var lectures = await super.find(params);

    return Promise.resolve(lectures);
  }
  async create(data, params){
    var response = '';
    var check = true;
    var arr = [];
    var req = ['lecture', 'type', 'school', 'dept', 'level', 'report', 'lecturer'];
    req.forEach(fd => {
        if(Object.keys(data).includes(fd)){
            
        }
        else{
            check = false;
            console.log(fd, 'missing');
            arr.push(fd);
        }
    });
    var lectures = await apps.service('lectures').find(params);
    // lectures = lectures.data;
    
    if(Object.keys(data).length >= 1){
      if(check){
        
        if(lectures.length >= 1){
          response = 'Lecture Created';
        }
        else{
          response =  "First Lecture";
          
        }
        
        if(response == 'Lecture Created' || response == 'First Lecture'){
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
    return Promise.resolve('Not allowed');
  }
};
