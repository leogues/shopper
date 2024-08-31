import * as Minio from 'minio'

export class StartMinio {
  private readonly bucketName: string
  private readonly minioClient: Minio.Client

  constructor(bucketName: string, minioClient: Minio.Client) {
    this.bucketName = bucketName
    this.minioClient = minioClient
  }

  async start() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)
    if (bucketExists) {
      console.log(`Bucket ${this.bucketName} já existe.`)
      return
    }
    await this.minioClient.makeBucket(this.bucketName, 'us-east-1')
    console.log(`Bucket ${this.bucketName} criado com sucesso.`)

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucket',
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
          ],
          Resource: ['arn:aws:s3:::shopper'],
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
            's3:PutObject',
          ],
          Resource: ['arn:aws:s3:::shopper/*'],
        },
      ],
    }

    await this.minioClient.setBucketPolicy(
      this.bucketName,
      JSON.stringify(policy)
    )
    console.log(`Bucket ${this.bucketName} agora é público.`)
  }
}
