const config = require('../config');
const models = require('../models');

module.exports = {
  posts: async function (req, res) {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;

    try {
      const posts = await models.Post.find({})
        .skip(perPage * page - perPage)
        .limit(perPage)
        .populate('owner')
        .sort({ createdAt: -1 });

      const count = await models.Post.count();

      res.render('archive/index', {
        posts,
        current: page,
        pages: Math.ceil(count / perPage),
        user: {
          id: userId,
          login: userLogin,
        },
      });
    } catch (err) {
      throw new Error('Выстрел в ногу');
    }
  },

  getPost: async function (req, res, next) {
    const urlPost = req.params.post.trim().replace(/ +(?= )/g, '');
    const id = req.session.id;
    const login = req.session.userLogin;

    if (!urlPost) {
      const err = new Error('Not Found 404');
      err.status = 404;
      next(err);
    } else {
      try {
        const post = await models.Post.findOne({
          url: urlPost,
        }).populate('owner');
        if (!post) {
          const err = new Error('Not Found 404');
          err.status = 404;
          next(err);
        } else {
          const comments = await models.Comment.find({
            post: post.id,
          }).populate('children');

          console.log(comments);
          res.render('post/post', {
            post,
            comments,
            user: {
              id: id,
              login: login,
            },
          });
        }
      } catch (error) {
        throw new Error('Выстрел в ногу');
      }
    }
  },

  userPosts: async function (req, res) {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;
    const login = req.params.login;

    try {
      const user = await models.User.findOne({
        login,
      });

      const posts = await models.Post.find({
        owner: user.id,
      })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .populate('owner')
        .sort({ createdAt: -1 });

      const count = await models.Post.count({
        owner: user.id,
      });

      res.render('archive/user', {
        posts,
        _user: user,
        current: page,
        pages: Math.ceil(count / perPage),
        user: {
          id: userId,
          login: userLogin,
        },
      });
    } catch (err) {
      throw new Error('Выстрел в ногу');
    }
  },
};
