const models = require('../models');

module.exports = {
  add: async function (req, res) {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!userId || !userLogin) {
      res.json({
        ok: false,
      });
    } else {
      const post = req.body.post;
      const body = req.body.body;
      const parent = req.body.parent;

      /*if (!body) {
        res.json({
          ok: false,
          error: 'Пустой комментариий',
        });
      }*/

      try {
        if (!parent) {
          await models.Comment.create({
            post,
            body,
            owner: userId,
          });
          res.json({
            ok: true,
            body,
            login: userLogin,
          });
        } else {
          const parentComment = await models.Comment.findById(parent);
          if (!parentComment) {
            res.json({
              ok: false,
            });
          }

          const comment = await models.Comment.create({
            post,
            body,
            parent,
            owner: userId,
          });

          const children = parentComment.children;
          children.push(comment.id);
          parentComment.children = children;
          await parentComment.save();

          res.json({
            ok: true,
            body,
            login: userLogin,
          });
        }
      } catch (error) {
        res.json({
          ok: false,
        });
      }
    }
  },
};
