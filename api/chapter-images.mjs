'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import MangaService from '/opt/services/mangaServices.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';


export const handler = async (event) => {
    const chapterId = event.pathParameters.chapterid;

    try {
        const mangaService = new MangaService(sequelize);

        const chapterImages = await mangaService.getChapterImageURLsOfChapter(chapterId);

        const response = JSON.stringify(chapterImages);

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
