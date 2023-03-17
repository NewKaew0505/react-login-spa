const bcrypt = require('bcrypt');
const db = require('../model');
const user = db.user;
const passwordmodel = db.password;
const jwt = require('jsonwebtoken');

exports.create = async (req, res) => {
  const {firstName, lastName, username, password, img} = req.body
  console.log(req.body)
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const user_ins = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: hash
  };
  if (req.file) {
    user_ins.img = req.file.path
  }

  const u = await user.findOne({ where: { username: username }})
  if (u) {
    res.status(500).json({
      message:
         "Username is duplicate."
    });
  }

  user.create(user_ins)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message:
          err.message || "Some error occurred."
      });
    });
}

exports.auth = async (req, res) => {
  const {username, password} = req.body
  const u = await user.findOne({ where: { username: username }})
  console.log("user", u)
  if(!u) {
    res.status(500).json({
      message:
        "Username is Wrong"
    });
  }

  

  if(bcrypt.compareSync(password, u?.password)) {
    const token = jwt.sign({ id:u.id, username: username }, process.env.JWT);
    res.status(200).json({
      data: {
        user:  {
          id:u.id, 
          firstName:u.firstName, 
          lastName:u.lastName, 
          username:u.username, 
          img:u.img, 
          jwt: token
        }
      }
    });
  }
  else {
    res.status(500).json({
      message:
        "Password is Wrong"
    });
  }
}

exports.update = async (req, res, err) => {
  const id = req.user.id;
  const { firstName, lastName, password } = req.body

  let data = {
    firstName: firstName,
    lastName: lastName,
  };

  if (req.file) {
    data.img = req.file.path
  }
  
  if (password) {
    const passwords = await passwordmodel.findAll({ where: {user_id:id}, limit: 5, order : [['createdAt', 'DESC'] ], raw : true});
    const samePassword = passwords.filter(x => bcrypt.compareSync(password, x.password))
    console.log("samePassword",samePassword.length)
    if (samePassword.length > 0) {
      res.status(500).json({
        message:
          "Password is duplicate"
      });
    }
    const getOldpassword = await user.findOne({ where: { id: id }})
    await passwordmodel.create({user_id : id, password : getOldpassword.password})


    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    data.password = hash;
  }

  await user.update(data, {
    where: { id: id }
  })
  const getUser = await user.findOne({ where: { id: id }})

  const token = jwt.sign({ id:getUser.id, username: getUser.bcryptusername }, process.env.JWT);

  res.status(200).json({
    data: {
      user:  {
        id:getUser.id, 
        firstName:getUser.firstName, 
        lastName:getUser.lastName, 
        username:getUser.username, 
        img:getUser.img, 
        jwt: token
      }
    }
  });
};
  
