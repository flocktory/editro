module.exports = function(Editro) {

  function upload(file) {
    const form = new FormData();
    form.append('file', file);

    return fetch(this.getOption('uploadUrl'), {
      method: 'POST',
      credentials: 'include',
      body: form
    }).then(r => r.json()).then(r => r.original);
  }

  function check(file) {
    if (!(file instanceof File)) {
      return new TypeError('Item is not a File instance');
    }
    const MAX_SIZE = this.getOption('uploadMaxSize');
    if (file.size > MAX_SIZE) {
      return new RangeError(`File ${file.name} has size ${file.size}.
        Only files with size less then ${MAX_SIZE} allowed.`);
    }
  }

  Editro.defineOption('uploadUrl', '/behemoth/image_upload');
  Editro.defineOption('uploadMaxSize', 1000 * 1000 * 10); // 10 MB

  Editro.defineExtension('upload', function(files) {
    const errors = files.map(check.bind(this));
    if (errors.filter(a => a).length) {
      return Promise.reject(errors);
    }

    return Promise.all(files.map(upload.bind(this)));
  });
};
