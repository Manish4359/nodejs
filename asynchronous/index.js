const { resolve4 } = require("dns");
const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject("file not found");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("file not found");
      resolve("sucess");
    });
  });
};

const getDog = async function () {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    if (!data) return;
    console.log(`breed:${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePro("./dod-img.txt", res.body.message);
    console.log("image saved in the file");
  } catch (err) {
    console.log("An error occured");
  }
};
getDog();

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`breed:${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro("./dod-img.txt", res.body.message);
  })
  .then(() => {
    console.log("image saved in the file");
  })
  .catch((err) => {
    console.log(err);
  });
*/
