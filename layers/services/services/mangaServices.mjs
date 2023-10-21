class MangaService {
    constructor(sequelize) {
        this.models = sequelize.models;
    }

    async getAllManga() {
        return await this.models.manga.findAll({
            include: [
                {
                    model: this.models.genre,
                    attributes: ['genre_name'],
                    through: {
                        attributes: []
                    },

                }
            ]
        });
    }

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

    async getChapterImageURLsOfChapter(chapterId) {
        try {
            // Find the chapter record by its ID
            const chapterRecord = await this.models.chapter.findByPk(chapterId, {
                include: 'chapter_images'
            });

            if (!chapterRecord) {
                throw new Error('Chapter not found');
            }

            // Access the associated chapter_images
            const chapterImages = chapterRecord.chapter_images;

            // Extract image URLs from the chapter_images
            const imageUrls = chapterImages.map((image) => image.chapter_image_url);

            return imageUrls;
        } catch (error) {
            console.error('Error getting chapter image URLs:', error.message);
            throw error;
        }
    }

}

export default MangaService;
