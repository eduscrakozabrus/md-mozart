function image (url) {
  return {
    type: 'picture',
    content: url,
  };
}

function text (content) {
  return {
    type: 'text',
    content,
  };
}

module.exports = {
  image,
  text,
};
