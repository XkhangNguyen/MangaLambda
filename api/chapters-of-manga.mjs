'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import MangaService from '/opt/services/mangaServices.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';


export const handler = async (event) => {
    const mangaId = event.pathParameters.mangaid;

    try {
        const mangaService = new MangaService(sequelize);

        const mangaChapters = await mangaService.getChaptersOfManga(mangaId);

        const response = JSON.stringify(mangaChapters);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: response,
        };
    } catch (error) {
        return handleErrorServices(error);
    }
};
