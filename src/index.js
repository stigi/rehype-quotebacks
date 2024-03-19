import {visit} from 'unist-util-visit'

const parseCite = node => {
  // checking basic cite structure
  if (
    !node
    || node.tagName !== 'p'
    || node.children.length !== 3
    || node.children[0].type !== 'text'
    || node.children[0].value !== 'Source: '
    || node.children[1].tagName !== 'a'
    || node.children[2].type !== 'text'
    || !node.children[2].value.startsWith(' by ')
  ) {
    return
  }

  return {
    author: node.children[2].value.slice(4),
    url: node.children[1].properties.href,
    publication: node.children[1].children[0].value,
  }
}

export default function rehypeQuotebacks() {
  return function (tree) {
    // console.log('tree', tree)
    visit(tree, {tagName: 'blockquote'}, (node, index, parent) => {
      if (!parent || !parent.children) {
        return
      }

      const maybeCite = parseCite(parent.children[index + 2])
      if (!maybeCite) {
        return
      }

      parent.children.splice(index + 2, 1) // remove cite, it's info be added into the quoteback

      // if cite is followed by a line break, remove it (happens when there's another block after the cite, like a code block or paragraph)
      if (
        parent.children[index + 2]
        && parent.children[index + 2].type === 'text'
        && parent.children[index + 2].value === '\n'
      ) {
        parent.children.splice(index + 2, 1)
      }

      // Found a blockquote with a cite. Let's turn it into a quoteback!

      node.properties = {
        className: ['quoteback'],
        'data-title': maybeCite.publication,
        'data-author': maybeCite.author,
        cite: maybeCite.url,
      }

      // Adding the cite footer inside the blockquote
      node.children = [...node.children, {
        type: 'element',
        tagName: 'footer',
        children: [
          {type: 'text', value: maybeCite.author},
          {
            type: 'element', tagName: 'cite', children: [
              {type: 'text', value: ' '},
              {
                type: 'element', tagName: 'a', properties: {href: maybeCite.url}, children: [{type: 'text', value: maybeCite.publication}],
              },
            ],
          },
        ],
      }, {type: 'text', value: '\n'}]

      // Adding the quoteback script after the blockquote
      parent.children.splice(
        index + 1,
        0,
        {type: 'text', value: '\n'},
        {
          type: 'element',
          tagName: 'script',
          properties: {
            note: '',
            src: 'https://cdn.jsdelivr.net/gh/Blogger-Peer-Review/quotebacks@1/quoteback.js',
          },
        },
      )
    })
  }
}
