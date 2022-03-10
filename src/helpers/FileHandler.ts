import { ExpressContext } from 'apollo-server-express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { FileUpload } from 'graphql-upload';

interface IFileHandlerOptions {
  /**
   * Mimetype accepté
   */
  accept?: string[];
}

interface IFileHandlerReturn {
  uploadPath: string;
}

export class FileHandler {
  static async upload(
    fileUpload: FileUpload,
    directory: String,
    options?: IFileHandlerOptions,
  ): Promise<IFileHandlerReturn> {
    const _options = options || {};

    const { createReadStream, filename, mimetype } = fileUpload;

    // On format le nom du fichier
    const formatFileName = `${Date.now()}-${filename
      .trim()
      .replace(/ /g, '_')}`;
    const directoryPath = `uploads/${directory}`;
    const uploadPath = `${directoryPath}/${formatFileName}`;

    // On verifie si le myme type du fichier correspond si il y en a
    if (_options.accept && !_options.accept?.includes(mimetype)) {
      throw new Error('Mimetype not allowed detected');
    }

    const write = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        // On check si le dossier existe
        const directoryExist = existsSync(`./static/${directoryPath}`);

        // Si il n'existe pas on le crée
        if (!directoryExist) {
          mkdirSync(`./static/${directoryPath}`, { recursive: true });
        }

        // Puis on l'ecrit
        createReadStream()
          .pipe(createWriteStream(`./static/${uploadPath}`))
          .on('finish', () => resolve(true))
          .on('error', (err) => reject(err));
      });
    };

    // try {
    await write();
    return { uploadPath };
    // } catch (err) {
    //   // console.log(err.);
    //   // if (err instanceof Error) {
    //   //   if (err.name === 'PayloadTooLargeError') {
    //   //     throw new Error({ error: { maxFileSize: true } });
    //   //   }
    //   //   // console.log(err.name);
    //   // }
    //   throw new Error(err);
    // }
  }

  static getStaticPath = (ctx: ExpressContext, relativePath: string) => {
    const urlFrom = (urlObject) =>
      String(Object.assign(new URL('http://a.com'), urlObject));
    const currentServeUrl = urlFrom({
      protocol: ctx.req.protocol,
      host: ctx.req.get('host'),
      pathname: relativePath,
    });
    return currentServeUrl;
  };
}
