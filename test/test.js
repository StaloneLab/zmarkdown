const chai = require('chai')
const expect = require('chai').expect
const helper = require('./helper')
const glob = require('glob')
const fs = require('fs')
chai.use(helper)
const loadFixture = (filepath) => String(fs.readFileSync(filepath.replace('.txt', '.html')))

const { renderFile } = require('../')

describe('HTML rendering', function () {
  describe('#basic', function () {
    const files = glob.sync(`${__dirname}/fixtures/basic/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#extensions', function () {
    const files = glob.sync(`${__dirname}/fixtures/extensions/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#misc', function () {
    const files = glob.sync(`${__dirname}/fixtures/misc/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#options', function () {
    const files = glob.sync(`${__dirname}/fixtures/options/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#php', function () {
    const files = glob.sync(`${__dirname}/fixtures/php/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#pl', function () {
    const files = glob.sync(`${__dirname}/fixtures/pl/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe.skip('#zds', function () {
    const files = glob.sync(`${__dirname}/fixtures/zds/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })
})
