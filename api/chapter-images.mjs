'use strict';

import sequelize from '/opt/models/dbConfig.mjs';

import handleErrorServices from '/opt/services/handleErrorServices.mjs';

const mangaService = {
    models: sequelize.models,

    async getChapterImageURLsOfChapter(chapterId) {
        try {
            // Find the chapter record by its ID
            const chapterRecord = await this.models.chapter.findByPk(chapterId, {
                include: 'chapter_image'
            });

            if (!chapterRecord) {
                throw new Error('Chapter not found');
            }

            return chapterRecord.chapter_image;

        } catch (error) {
            console.error('Error getting chapter image URLs:', error.message);
            throw error;
        }
    }
}


export const handler = async (event) => {
    const chapterId = event.pathParameters.chapterid;

    try {
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
