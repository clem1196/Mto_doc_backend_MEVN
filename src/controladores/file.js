//const uploadFile = require("../middlewares/upload");
const uploadFiles = require("../middlewares/upload");
const fs = require("fs");

const uploads = async (req, res) => {
  try {
    await uploadFiles(req, res);   
    let Files=req.files    
    //console.log(req.files)
    if (Files == undefined || !Files.length || Files.length>12) {
      return res.status(400).send({ message: " Selecione al menos de 1 a 12 archivos" });
    } else {
      res.status(200).send({ Message: 'successfull', files: Files });      
    }
  } catch (err) {
    res.status(500).send({error:" Selecione al menos de 1 a 12 archivos con extensión pdf, jpg y jpeg"});
    console.log({err:" Selecione al menos de 1 a 12 archivos con extensión pdf, jpg y jpeg"});
  }
};

const getListFiles = (req, res) => {
  const directoryPath = "D:\\Doc_registro\\uploads"  /*__basedir + "/resources/uploads/"*/;
  const baseUrl = `http://${req.headers.host}/api/file/`

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({ message: "No hay archivos que mostrar" });

    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};
const descargar = (req, res) => {
  let fileName = req.params.name;
  //console.log(fileName) 
  let directoryPath ="D:\\Doc_registro\\uploads/"  /*__basedir + "/resources/uploads/"*/ + fileName;  
  res.download(directoryPath, fileName, (err) => {
    if (err)
      res.status(500).send('El archivo no existe o fue eliminado');
  });
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = "D:\\Doc_registro\\uploads"  /*__basedir + "/resources/uploads/"*/;
  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      return res.status(500).send({ message: "No se puede eliminar puede que el archivo ya no exista " + err });
    } else {
      res.status(200).send({ Message: 'Eliminado' })
    }
  });
};
module.exports = {  
  uploads,
  getListFiles,
  descargar,
  deleteFile
};