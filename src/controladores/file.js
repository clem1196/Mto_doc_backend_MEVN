const uploadFile = require("../middlewares/upload");
const fs = require("fs");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    const File = req.file;
    if (File == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    const ext = File.originalname.split('\.')[1];
    console.log(ext)
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'pdf') {
      return res.status(200).send({
        message: "Uploaded the file successfully: ", file: req.file
      });
    }
    res.status(500).send({ Message: 'solo se acepta archivos con extension pdf, png, jpg y jpeg' })

  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}.${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/uploads";
  const baseUrl=`http://${req.headers.host}/api/files/`

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({ message: "Unable to scan files!" });
      
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url:baseUrl + file,
      });
    });   
    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};