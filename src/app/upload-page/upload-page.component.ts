import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { async } from '@angular/core/testing';

declare const Buffer

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

    console.log(this.fotos)

  }

  async deleteFoto(key: any) {

    debugger

    var params = {
      Bucket: 'angular-photo-bucket',
      Key: key
    };

    try {
      await bucket.headObject(params).promise()
      console.log("arquivo encontrado")
      try {
        await bucket.deleteObject(params).promise().then(() => {
          this.listaFotos()
        })
        console.log("arquivo apagado com sucesso")
      }
      catch (err) {
        console.log("ERRO ao apagar arquivo: " + JSON.stringify(err))
      }
    } catch (err) {
      console.log("Arquivo não encontrado : " + err.code)
    }

    console.log(key)

  }

}
