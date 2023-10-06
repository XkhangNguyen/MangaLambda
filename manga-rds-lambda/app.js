import Sequelize from 'sequelize';
import Models from './models/index.js';
import MangaService from './services/mangaService.js';

export const lambdaHandler = async (event, context) => {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
    });

    Models(sequelize);

    try {
        await sequelize.authenticate();

        await sequelize.sync();

        const mangaService = new MangaService(sequelize);

        const mangasData = await mangaService.getAllManga();

        const mangasJSON = await Promise.all(
            mangasData.map(async (manga) => {
              const genres = await mangaService.getGenreOfManga(manga.MangaTitle);
              const chapters = await mangaService.getChaptersOfManga(manga.MangaTitle);
      
              const chaptersWithImages = await Promise.all(chapters.map(async (chapter) => {
                const chapterNumber = chapter.ChapterNumber;
                const chapterLink = chapter.ChapterLink;
                const chapterImageURLs = await mangaService.getChapterImageURLsOfChapter(chapter);
                return {
                  ChapterNumber: chapterNumber,
                  ChapterLink: chapterLink,
                  ChapterImageURLs: chapterImageURLs,
                };
              }));
      
              return {
                ...manga.toJSON(),
                Genres: genres.map((genre) => genre.genre_name),
                Chapters: chaptersWithImages,
              };
            })
          );

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
      const errorResponse = {
          statusCode: 500,
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: error.message }),
        };

      return errorResponse;
    } finally {
        sequelize.close();
    }
};

