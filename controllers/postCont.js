const models = require('../models');
const TurndownService = require('turndown');

module.exports = {
  addPostPage: function (req, res) {
    const id = req.session.id;
    const login = req.session.userLogin;
    console.log(id, login);

    if (!id || !login) {
      res.redirect('/');
    } else {
      res.render('post/add', {
        user: {
          id,
          login,
        },
      });
    }
  },

  addPost: function (req, res) {
    const id = req.session.userId;
    const login = req.session.userLogin;

    console.log(id, login);

    if (!id || !login) {
      res.redirect('/');
    } else {
      let turndownService = new TurndownService();
      const title = req.body.title.trim().replace(/ +(?= )/g, '');
      const body = req.body.body;

      if (!title || !body) {
        const fields = [];
        for (let field in req.body) {
          if (!req.body[field]) fields.push(field);
        }
        res.json({
          ok: false,
          error: 'Все поля должны быть заполнены',
          fields: fields,
        });
      } else if (title.length < 3 || title.length > 64) {
        res.json({
          ok: false,
          error: 'Длина заголовка от 3 до 64 символов',
          fields: ['title'],
        });
      } else if (body.length < 3) {
        res.json({
          ok: false,
          error: 'Текст не менее 3-ех символов',
          fields: ['body'],
        });
      } else {
        models.Post.create({
          title,
          body: turndownService.turndown(body),
          owner: id,
        })
          .then((post) => {
            console.log(post);
            res.json({
              ok: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              ok: false,
              error: 'Выстрел в ногу. База данных упала, фиксим проблему...',
            });
          });
      }
    }
  },
};
