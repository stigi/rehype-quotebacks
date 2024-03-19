import test from 'ava'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import rehypeQuotebacks from './src/index.js'

const process = async markdown =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeQuotebacks)
      .use(rehypeStringify).process(markdown),
  )

// Tests

test('Processes one line quotes in isolation', async t => {
  const markdown = `> Here's something smart I wrote so you can quote.

Source: [My Blog](https://example.org/blog) by Anonymous Author
`

  t.snapshot(await process(markdown))
})

test('Processes multiline quotes in isolation', async t => {
  const markdown = `> Here's something smart I wrote so you can quote:
>
> Words flow with great ease,
> Thoughts become wisdom in ink,
> Smartness on the page.

Source: [My Blog](https://example.org/blog) by Anonymous Author
`

  t.snapshot(await process(markdown))
})

test('Processes one line quotes in context', async t => {
  const markdown = `# How to quoteback?

> Here's something smart I wrote so you can quote.

Source: [My Blog](https://example.org/blog) by Anonymous Author

And this is how you quoteback.
`

  t.snapshot(await process(markdown))
})

test('Processes multiline quotes in context', async t => {
  const markdown = `# How to quoteback?

> Here's something smart I wrote so you can quote:
>
> Words flow with great ease,
> Thoughts become wisdom in ink,
> Smartness on the page.

Source: [My Blog](https://example.org/blog) by Anonymous Author

And this is how you quoteback.
`

  t.snapshot(await process(markdown))
})
