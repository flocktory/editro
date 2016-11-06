function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let loaded = false;
    reader.addEventListener('load', function () {
      resolve(reader.result);
      loaded = true;
    }, false);
    reader.readAsDataURL(file);

    setTimeout(() => {
      if (!loaded) {
        reject(new Error('File base64 load fail.'));
      }
    }, 10000);
  });
}

module.exports = function(Editro) {
  Editro.defineExtension('upload', function(files) {
    return Promise.all(files.map(toBase64));
  });
};
