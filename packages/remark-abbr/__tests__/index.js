import dedent from 'dedent'
import { unified } from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import remarkAbbr from '../lib/index'

const render = (text, config) => unified()
  .use(reParse)
  .use(remarkAbbr, config)
  .use(remark2rehype)
  .use(stringify, {
    handlers: {
      // Prevent empty divs
      abbrDefinition: () => undefined,
    },
  })
  .processSync(text)

const renderToMarkdown = (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(remarkAbbr, config)
  .processSync(text)

const configToTest = {
  'no-config': undefined,
  'empty object': {},
  expandFirst: {expandFirst: true},
}

for (const [configName, config] of Object.entries(configToTest)) {
  it(`${configName} renders references`, () => {
    const {value} = render(dedent`
      This is an abbreviation: REF.
      ref and REFERENCE should be ignored.

      Here is another one in a link: [FOO](http://example.com).

      Here is the first one in a link: [REF](http://example.com).

      *[REF]: Reference
      *[FOO]: Reference
    `, config)

    expect(value).toMatchSnapshot()
  })


  it(`${configName} passes the first regression test`, () => {
    const {value} = render(dedent`
      The HTML specification is maintained by the W3C:\
      [link](https://w3c.github.io/html/), this line had an abbr before link.

      A line with [a link](http://example.com) before an abbr: HTML.

      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `, config)

    expect(value).toMatchSnapshot()
  })

  it(`${configName} passes the second regression test`, () => {
    const {value} = render(dedent`
      The HTML specification is maintained by the W3C:\
      [link](https://w3c.github.io/html/), this line had an abbr before **link** HTML.

      A line with [a link](http://example.com) before an abbr: HTML.

      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `, config)

    expect(value).toMatchSnapshot()
  })

  it(`${configName} passes the retro test`, () => {
    const input = dedent`
      An ABBR: "REF", ref and REFERENCE should be ignored.

      The HTML specification is maintained by the W3C.

      *[REF]: Reference
      *[ABBR]: This gets overridden by the next one.
      *[ABBR]: Abbreviation
      *[HTML]: Hyper Text Markup Language
      *[W3C]:  World Wide Web Consortium
    `

    const {value: html} = render(input)
    expect(html).toMatchSnapshot()

    const {value: markdown} = renderToMarkdown(input)
    expect(markdown).toMatchSnapshot()
  })

  it(`${configName} no reference`, () => {
    const {value} = render(dedent`
      No reference!
    `, config)

    expect(value).toMatchSnapshot()
  })

  test('compiles to markdown', () => {
    const md = dedent`
      *abbr* HTML

      > HTML inside quote

      *[abbr]: abbreviation
      *[noabbr]: explanation that does not match
      *[HTML]: HyperText Markup Language
    `
    const {value} = renderToMarkdown(md)
    expect(value).toMatchSnapshot()

    const value1 = renderToMarkdown(md).value
    const value2 = renderToMarkdown(value1).value

    expect(value1).toBe(value2)
  })

  it(`${configName} handles abbreviations ending with a period`, () => {
    const {value} = render(dedent`
      A.B.C. and C-D%F. foo

      *[A.B.C.]: ref1
      *[C-D%F.]: ref2
    `, config)

    expect(value).toContain(`<abbr title="ref1">A.B.C.</abbr>`)
    expect(value).toContain(`<abbr title="ref2">C-D%F.</abbr>`)
  })

  it(`${configName} does not parse words starting with abbr`, () => {
    const {value} = render(dedent`
      ABC ABC ABC

      *[AB]: ref1
    `, config)

    expect(value).not.toContain('<abbr')
  })

  it(`${configName} does not parse words ending with abbr`, () => {
    const {value} = render(dedent`
      ABC ABC ABC

      *[BC]: ref1
    `, config)

    expect(value).not.toContain('<abbr')
  })

  it(`${configName} does not parse words containing abbr`, () => {
    const {value} = render(dedent`
      ABC ABC ABC

      *[B]: ref1
    `, config)

    expect(value).not.toContain('<abbr')
  })

  it(`${configName} does not break with references in their own paragraphs`, () => {
    const {value} = render(dedent`
      Here is a test featuring abc and def

      *[abc]: A B C

      *[def]: D E F
    `, config)

    expect(value).toMatchSnapshot()
  })
}
