const faker = require('faker');
const models = require('./models');
const TurndownService = require('turndown');
const owner = '5f8f1598d4dab52dc81ead8f';

module.exports = () => {
    models.Post.remove()
        .then( ()=> {
            Array.from({length: 20}).forEach(() => {
                let turndownService = new TurndownService();
                models.Post.create({
                    title: faker.lorem.words(5),
                    body: turndownService.turndown(faker.lorem.words(100)),
                    owner: owner
                }).then(console.log)
                    .catch(console.log)
            })
        }).catch(console.log)
}