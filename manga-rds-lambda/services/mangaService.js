import Models from '../models/index.js';

class MangaService {
    constructor(sequelize) {
        Models(sequelize);
        this.models = sequelize.models;
    }

    async getAllManga() {
        return await this.models.manga.findAll();
    }

    async getMangaByTitle(mangaTitle) {
        return await this.models.manga.findOne({ where: { title: mangaTitle } });
    }

    async getChaptersOfManga(mangaTitle) {
        try {
            const manga = await this.models.manga.findOne({
                where: { title: mangaTitle },
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

    async getChapterImageURLsOfChapter(chapter) {
        try {
            // Find the chapter record by its ID
            const chapterRecord = await chapter.reload({ include: 'chapter_images' });

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
