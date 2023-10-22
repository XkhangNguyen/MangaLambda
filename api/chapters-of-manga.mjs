'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';

const mangaService = {
    models: sequelize.models,

    async getChaptersOfManga(mangaId) {
        try {
            const manga = await this.models.manga.findByPk(mangaId, {
                include: [
                    {
                        model: this.models.chapter,
                    },
                ],
            })

            if (!manga) {
                throw new Error('Manga not found');
            }

            const chapters = manga.chapters;

            return chapters;
        } catch (error) {
            console.error('Error getting chapters of manga:', error.message);
            throw error;
        }
    }
}


export const handler = async (event) => {
    const mangaId = event.pathParameters.mangaid;

    try {
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
