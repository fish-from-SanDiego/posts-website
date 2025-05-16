import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigNamespaces } from '../config/config.namespaces';
import { AppConfig } from '../config/app.config.type';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService<ConfigNamespaces>) {
    const appConfig = configService.getOrThrow<AppConfig>('app');
    this.bucket = appConfig.storageBucket;
    this.s3 = new S3Client({
      region: 'ru-central1',
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: appConfig.storageAccessKey,
        secretAccessKey: appConfig.storageSecretKey,
      },
    });
    this.baseUrl = `https://storage.yandexcloud.net/${this.bucket}`;
  }

  getUserPictureSubPath(userId: number) {
    return `profilePictures/${userId}_${Date.now()}`;
  }

  getSubPath(pictureUrl: string) {
    return pictureUrl.replace(`${this.baseUrl}/`, '');
  }

  async uploadFile(
    file: Express.Multer.File,
    subPath: string,
  ): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: subPath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );
    return `${this.baseUrl}/${subPath}`;
  }

  async deleteFile(subPath: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: subPath,
      }),
    );
  }
}
