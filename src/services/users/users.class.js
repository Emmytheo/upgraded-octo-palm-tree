const { Service } = require('feathers-mongodb');

exports.Users = class Users extends Service {
  constructor(options, app) {
    super(options);
    
    app.get('mongoClient').then(db => {
      this.Model = db.collection('users');
    });
  }
  create (data, params) {
    // This is the information we want from the user signup data
    const { email, password, githubId, name } = data;
    // Use the existing avatar image or return the Gravatar for the email
    const avatar = data.avatar || 'assets/images/users/avatar.svg';
    // The complete user
    const userData = {
      email,
      name,
      password,
      
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params);
  }  
};
