import { Payload } from 'payload';
import path from 'path';

export const seed = async (payload: Payload) => {
  payload.logger.info('Seeding data...');

  await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'test',
    }
  });

  const { id: mountainPhotoID } = await payload.create({
    collection: 'media',
    filePath: path.resolve(__dirname, 'mountain-range.jpg'),
    data: {
      alt: 'Mountains',
    },
  });


  await payload.create({
    collection: 'lexicalRichText',
    data: {
      title: 'Hello, world!',
      slug: 'hello-world',
      excerpt: 'This is a post',
      meta: {
        image: mountainPhotoID
      }
    },
  })
}
