const bcrypt = require('bcrypt-nodejs');
const models = require('../models');

module.exports = {
  register: function (req, res) {
    const { login, password, passwordConfirm } = req.body;
    //Если поля пустые, то возвращаем ошибку
    if (!login || !password || !passwordConfirm) {
      const fields = [];
      for (let field in req.body) {
        if (!req.body[field]) fields.push(field);
      }

      res.json({
        ok: false,
        error: 'Все поля должны быть заполнены',
        fields: fields,
      });
      //Проверка на символы
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
      res.json({
        ok: false,
        error: 'Логин должен содержать буквы латинского алфавита и цифры',
        fields: ['login'],
      });
      //Если все ок, то продолжаем проводить валидацию введенных юзером значений
    } else if (login.length < 3 || login.length > 16) {
      res.json({
        ok: false,
        error: 'Длина логина от 3 до 16 символов',
        fields: ['login'],
      });
    } else if (password !== passwordConfirm) {
      res.json({
        ok: false,
        error: 'Введенные пароли не совпадают',
        fields: ['password', 'passwordConfirm'],
      });
    } else if (password.length < 4) {
      res.json({
        ok: false,
        error: 'Минимальная длина пароля 3 символа',
        fields: ['password'],
      });
      //Если все валидации пройдены, то шифруем пароль и кидаем его в базу данных
    } else {
      models.User.findOne({
        login,
      }).then((user) => {
        if (!user) {
          bcrypt.hash(password, null, null, (err, hash) => {
            models.User.create({
              login: login,
              password: hash,
            })
              .then((user) => {
                req.session.userId = user.id;
                req.session.userLogin = user.login;
                res.json({
                  ok: true,
                });
              })
              .catch((err) => {
                res.json({
                  ok: false,
                  error:
                    'Выстрел в ногу. База данных упала, фиксим проблему...',
                });
              });
          });
        } else {
          res.json({
            ok: false,
            error: 'Пользователь с таким именем уже существует',
          });
        }
      });
    }
  },
  login: function (req, res) {
    const { login, password } = req.body;

    if (!login || !password) {
      const fields = [];
      for (let field in req.body) {
        if (!req.body[field]) fields.push(field);
      }
      res.json({
        ok: false,
        error: 'Все поля должны быть заполнены',
        fields: fields,
      });
    } else {
      models.User.findOne({
        login,
      })
        .then((user) => {
          if (!user) {
            res.json({
              ok: false,
              error: 'Неверное имя пользователя или пароль',
              fields: ['login', 'password'],
            });
          } else {
            bcrypt.compare(password, user.password, (error, result) => {
              if (!result) {
                res.json({
                  ok: false,
                  error: 'Неверное имя пользователя или пароль',
                  fields: ['login', 'password'],
                });
              } else {
                req.session.userId = user.id;
                req.session.userLogin = user.login;
                res.json({
                  ok: true,
                });
              }
            });
          }
        })
        .catch((err) => {
          res.json({
            ok: false,
            error: `Что-то пошло не так, походу выстрел в ногу, фиксим + ${err}`,
          });
        });
    }
  },
  logout: function (req, res) {
    if (req.session) {
      // delete session object
      req.session.destroy(() => {
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  },
};
