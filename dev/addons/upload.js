module.exports = function(Editro) {

  const MAX_SIZE = 1000 * 1000; // MB
  function behemot(file) {
    const form = new FormData();
    form.append('file', file);

    return fetch('/behemoth/image_upload', {
      method: 'POST',
      credentials: 'include',
      body: form
    }).then(r => r.json()).then(r => r.original);
  }

  function check(file) {
    if (!file instanceof File) {
      return new TypeError('Item is not a File instance');
    }
    if (file.size > MAX_SIZE) {
      return new RangeError(`File ${file.name} has size ${file.size}.
        Only files with size less then ${MAX_SIZE} allowed.`);
    }
  }

  Editro.defineExtension('upload', function(files) {
    const errors = files.map(check);
    if (errors.filter(a => a).length) {
      return Promise.reject(errors);
    }

    return Promise.all(files.map(behemot));
  });
};
