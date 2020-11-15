const faker = require('faker');
const models = require('./models');
const TurndownService = require('turndown');
const owner = '5fb10eb2d7cf49385d74f35e';

module.exports = () => {
  models.Post.remove()
    .then(() => {
      Array.from({ length: 20 }).forEach(() => {
        let turndownService = new TurndownService();
        models.Post.create({
          title: faker.lorem.words(5),
          body: turndownService.turndown(faker.lorem.words(100)),
          owner: owner,
        })
          .then(console.log)
          .catch(console.log);
      });
    })
    .catch(console.log);
};
