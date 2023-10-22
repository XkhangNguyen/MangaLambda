'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';

const mangaService = {
    models: sequelize.models,

    async getMangasOfGenre(genreId) {
        return await this.models.manga.findAll({
            include: [{
                model: this.models.genre,
                attributes: ['genre_name'],
                through: {
                    attributes: []
                },
                where: {
                    id: genreId,
                },
            }]
        })
    }
}


export const handler = async (event) => {
    try {
        const genreId = event.pathParameters.genreid;

        const mangaRecords = await mangaService.getMangasOfGenre(genreId);

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
