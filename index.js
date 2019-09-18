var markdown = require('markdown');
var assert = require('assert');
var formats = require('./mozartFormats.js');

function concatArrays (iter, item) {
  return iter.concat(item);
}

function extractText (item) {
  if (typeof item === 'string') {
    if (/^\s+$/.test(item)) {
      return null;
    }
    return formats.text(item.trim());
  }
  return parseNode(item);
}

function parseNode (node) {
  var type = node[0];

  switch (type) {
    case 'img':
      return [formats.image(node[1].href)];
    case 'para':
    case 'em':
    case 'strong':
    case 'code_block':
      return node.slice(1)
        .map(extractText)
        .reduce(concatArrays, []);
    case 'header':
      return node.slice(2)
        .map(extractText)
        .reduce(concatArrays, []);
    case 'link':
      var details = node[1];
      var text = node[2];
      if (details.href !== text) {
        return formats.text(text + ' (' + details.href + ')');
      }
      return formats.text(details.href);
    default:
      console.error('unsupported format :', node);
      return null;
  }
}

function parseText (md) {
  if (typeof md !== 'string') {
    throw new TypeError('first argument must be a string');
  }

  var tree = markdown.markdown.parse(md);
  assert(tree[0] === 'markdown');

  return tree
    .slice(1)
    .map(parseNode)
    .reduce(concatArrays, [])
    .filter(function (elem) { return !!elem; });
}

module.exports = parseText;
