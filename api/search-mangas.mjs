'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import { Op } from 'sequelize';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';

const mangaService = {
  models: sequelize.models,

  async searchMangas(query) {
    const results = await this.models.manga.findAll({
      where: {
        title: sequelize.where(
          sequelize.fn('unaccent', sequelize.col('title')),
          'ILIKE',
          sequelize.fn('unaccent', `%${query}%`)
        ),
      },
    });
  
      return results;  
    }
}

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters.query;

    const mangaRecords = await mangaService.searchMangas(query);

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(mangaRecords),
    };

    return response;
  } catch (error) {
    return handleErrorServices(error);
  }
};
