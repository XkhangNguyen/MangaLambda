'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';

const mangaService = {
  models: sequelize.models,

  async getAllGenres() {
    return await this.models.genre.findAll();
  },
};

export const handler = async (event) => {
  try {

    const genreRecords = await mangaService.getAllGenres();

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(genreRecords),
    };

    return response;
  } catch (error) {
    return handleErrorServices(error);
  }
};
