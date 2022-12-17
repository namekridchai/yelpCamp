const Joi = require('Joi');
const Schema = Joi.object(
    {review:Joi.object(
      {
        body:Joi.string().required(),
        rating:Joi.number().required().min(0).max(5),
      }
    ).required()
    })
module.exports = Schema