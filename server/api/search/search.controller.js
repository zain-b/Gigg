var eventsModel = require('../events/events.model');

/**
 * events.controller.js
 *
 * @description :: Server-side logic for searching events and stories.
 *
 * TODO: Rework search a little bit so that search matches 'text' AND 'location' rather than 'OR'.
 */

module.exports = {

    /**
     * eventsController.list()
     */
    searchEvents: function (req, res) {
        let query = makeGenericQuery(req);

        eventsModel.find(query)
            .populate('creator', '-password')
            .sort('-createdAt')
            .exec(function (err, events) {
                if (err) {
                    return res.status(500).json({
                        error: 'Error getting events.',
                        message: 'Error getting events.'
                    });
                }
                return res.json(events);
            });
    }

};

/**
 * Function to search by all three parameters: title, description, location and date range. All optional.
 * @param req
 *
 * TODO: Date strings are not verified to be valid date strings yet.
 */
function makeGenericQuery(req) {
    let query = {};

    if (req.query.text || req.query.location) {
        query.$text = {};
    }

    if (req.query.text && req.query.location) {
        query.$text.$search = req.query.text + " " + req.query.location;
    } else if (req.query.text) {
        query.$text.$search = req.query.text;
    } else if (req.query.location) {
        query.$text.$search = req.query.location;
    }

    if (req.query.date) {
        query.date = {};
        let providedDate = new Date(req.query.date);
        let dateRangeBottom = new Date(providedDate.toISOString());
        let dateRangeTop = new Date(providedDate.toISOString());

        dateRangeBottom = dateRangeBottom.setDate(providedDate.getDate() - 5);
        dateRangeTop = dateRangeTop.setDate(providedDate.getDate() + 5);

        query.date.$gte = dateRangeBottom;
        query.date.$lte = dateRangeTop;
    }

    return query;
}

