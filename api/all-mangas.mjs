'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import MangaService from '/opt/services/mangaServices.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';


export const handler = async (event) => {
  try {
    const mangaService = new MangaService(sequelize);

    const mangaRecords = await mangaService.getAllManga();

    const mangasJSON = mangaRecords.map((record) => {
      const mangaJSON = record.toJSON();

      // Rename "genres" to "Genres"
      mangaJSON.Genres = mangaJSON.genres;
      delete mangaJSON.genres;

      return mangaJSON;
    })

    console.log(mangasJSON);

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(mangasJSON),
    };

    return response;
  } catch (error) {
    return handleErrorServices(error);
  }
};
