import { Component, OnInit } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';

export interface Tile {
  cols: number;
  rows: number;
  text: string;
  border: string;
}

const bucket = new S3(
  {
    accessKeyId: 'AKIAUH6QAHRGG4ECYK6C',
    secretAccessKey: '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',
    region: 'us-east-2'
  }
)

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent implements OnInit {

  tiles: Tile[] = [
    { text: 'Tile 1', cols: 1, rows: 1, border: '3px double purple' },
    { text: 'Tile 2', cols: 1, rows: 1, border: '3px double red' },
    { text: 'Tile 3', cols: 1, rows: 1, border: '3px double skyblue' },
    { text: 'Tile 4', cols: 1, rows: 1, border: '3px double yellow' },
  ];

  isLoading: boolean = false

  image: any
  selectedFiles: FileList;
  url: any = 'https://angular-photo-bucket.s3.us-east-2.amazonaws.com/'

  fotos: Array<any> = []

  constructor() { }

  ngOnInit() {

    this.listaFotos()

  }

  //salva foto no AWS
  uploadFile(file) {

    //debugger

    this.isLoading = true

    const contentType = file.type;

    const params = {
      Bucket: 'angular-photo-bucket',
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      this.listaFotos()
      return true;
    }).promise().then(() => {
      this.isLoading = false
      this.listaFotos()
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  async upload() {

    const file = this.selectedFiles.item(0);

    this.uploadFile(file)

  }

  //lista fotos do AWS
  async listaFotos() {

    //debugger    

    this.isLoading = true

    const params = {
      Bucket: 'angular-photo-bucket'
    }

    //debugger

    const data = await bucket.listObjects(params).promise();

    this.fotos = []

    if (data['Contents'].length > 0) {

      for (var i = 0; i < data['Contents'].length; i++) {

        this.fotos.push({
          url: this.url + data['Contents'][i]['Key'],
          key: data['Contents'][i]['Key']
        })

      }

    }

    this.isLoading = false

    console.log(this.fotos)

  }

  async deleteFoto(key: any) {

    debugger

    this.isLoading = true

    var params = {
      Bucket: 'angular-photo-bucket',
      Key: key
    };

    try {
      await bucket.headObject(params).promise()
      console.log("arquivo encontrado")
      try {
        await bucket.deleteObject(params).promise().then(() => {
          this.isLoading = false
          this.listaFotos()
        })
        console.log("arquivo apagado com sucesso")
      }
      catch (err) {
        console.log("ERRO ao apagar arquivo: " + JSON.stringify(err))
        this.isLoading = false
      }
    } catch (err) {
      console.log("Arquivo não encontrado : " + err.code)
      this.isLoading = false
    }

    console.log(key)

  }

}
