const {WebhookClient} = require('dialogflow-fulfillment');

const mongoose = require('mongoose');
const MeasureBookDemand = mongoose.model('bookDemand');
const Coupon = mongoose.model('coupon');

module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({ request: req, response: res });

        async function readBooks(agent) {
            MeasureBookDemand.findOne({'book': agent.parameters.book}, function(err, book) {
                if (book !== null ) {
                    book.counter++;
                    book.save();
                } else {
                    const bookDemand = new MeasureBookDemand({book: agent.parameters.book});
                    bookDemand.save();
                }
            });
            let responseText = `You want to read about ${agent.parameters.book}. 
            					Here is a link to Amazon Book Reviews: https://www.amazonbookreview.com/`;

            let coupon = await Coupon.findOne({'book': agent.parameters.book});
            if (coupon !== null ) {
                responseText = `You want to read ${agent.parameters.book}. Here is a link to the book: ${coupon.link}`;
            }					

            agent.add(responseText);
        }

        function fallback(agent) {
            agent.add(`I didn't understand that`);
            agent.add(`Sorry, what was that?`);
            agent.add(`I didn't quite catch that`);
            agent.add(`I'm sorry, can you try again?`);
            agent.add(`Can you repeat that?`);
            agent.add(`Can you rephrase that, please?`);
        }
        let intentMap = new Map();
        intentMap.set('read books', readBooks);

        intentMap.set('Default Fallback Intent', fallback);

        agent.handleRequest(intentMap);
    });
}