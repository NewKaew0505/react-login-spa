module.exports = (sequelize, Sequelize) => {
    const Password = sequelize.define("password", {
      user_id: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return Password;
  };