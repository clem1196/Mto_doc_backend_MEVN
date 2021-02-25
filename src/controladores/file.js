//const uploadFile = require("../middlewares/upload");
const uploadFiles = require("../middlewares/upload");
const fs = require("fs");
const { report } = require("process");

const uploads = async (req, res) => {
  try {
    await uploadFiles(req, res);   
    let Files=req.files
    console.log(req.files)
    if (Files == undefined || !Files.length) {
      return res.status(400).send({ message: "Please upload a files!" });
    } else {
      res.status(200).send({ Message: 'successfull', files: Files })
    }
  } catch (err) {
    res.status(500).send({
      error: 'Seleccione al menos un archivo, Solo se admiten extensión pdf, jpg y jpeg',
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/uploads";
  const baseUrl = `http://${req.headers.host}/api/file/`

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({ message: "Unable to scan files!" });

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
  let directoryPath = __basedir + "/resources/uploads/" + fileName;
  //console.log({ name: fileName, url: directoryPath })
  res.download(directoryPath, directoryPath, (err) => {
    if (err)
      res.status(500).send('El archivo no existe o fue eliminado');
  });
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/uploads/";
  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      return res.status(500).send({ message: "Could not download the file. " + err });
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