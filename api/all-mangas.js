'use strict';

const sequelize = require('sequelize')

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'ALL MANGAS',
        input: event,
      },
      null,
      2
    ),
  };
};
