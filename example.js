import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import rehypeQuotebacks from './src/index.js'

const processor = await unified()
  .use(remarkParse) // parses markdown
  .use(remarkRehype) // converts markdown to html
  .use(rehypeQuotebacks) // converts html to html with quotebacks
  .use(rehypeStringify) // converts html to string

const markdown = `
> My quote

Source: [My Blog](https://example.org/blog) by Anonymous Author
`

const result = processor.processSync(markdown)

console.log(String(result))
