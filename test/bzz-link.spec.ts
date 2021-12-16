import { NotEnabledError, RedirectCidError, requestFilter, routerClosure } from '../src/bzz-link'
import { Substitute } from '@fluffy-spoon/substitute'
import { Request } from 'express'

describe('bzz.link', () => {
  describe('requestFilter', () => {
    it('should return true for subdomain', async () => {
      const req = Substitute.for<Request>()
      req.subdomains.returns!(['someEnsName'])

      expect(requestFilter('', req)).toStrictEqual(true)
    })

    it('should return false for no subdomain', async () => {
      const req = Substitute.for<Request>()
      req.subdomains.returns!([])

      expect(requestFilter('', req)).toStrictEqual(false)
    })
  })

  describe('routerClosure', () => {
    const MANIFEST = {
      cid: 'bah5acgzamh5fl7emnrazttpy7sag6utq5myidv3venspn6l5sevr4lko2n3q',
      legacyCid: 'bafybwidb7jk7zddmigm436h4qbxve4hlgca5o5jdmt3ps7mrfmpc2twto4',
      reference: '61fa55fc8c6c4199cdf8fc806f5270eb3081d7752364f6f97d912b1e2d4ed377',
    }

    it('should translate valid CID', async () => {
      const router = routerClosure('http://some.bee', true, true)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`${MANIFEST.cid}.bzz.link`)

      expect(router(req)).toEqual(`http://some.bee/bzz/${MANIFEST.reference}`)
    })

    it('should translate valid CID with ENS disabled', async () => {
      const router = routerClosure('http://some.bee', true, false)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`${MANIFEST.cid}.bzz.link`)

      expect(router(req)).toEqual(`http://some.bee/bzz/${MANIFEST.reference}`)
    })

    it('should translate valid ENS', async () => {
      const router = routerClosure('http://some.bee', true, true)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`some-ens-domain.bzz.link`)

      expect(router(req)).toEqual(`http://some.bee/bzz/some-ens-domain.eth`)
    })

    it('should translate valid ENS when CID is disabled', async () => {
      const router = routerClosure('http://some.bee', false, true)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`some-ens-domain.bzz.link`)

      expect(router(req)).toEqual(`http://some.bee/bzz/some-ens-domain.eth`)
    })

    it('should throw redirection error for legacy CID', async () => {
      const router = routerClosure('http://some.bee', true, true)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`${MANIFEST.legacyCid}.bzz.link`)
      req.protocol.returns!(`http`)
      req.originalUrl.returns!(`/`)

      try {
        router(req)
        throw new Error('Should have thrown an RedirectCidError')
      } catch (e) {
        if (!(e instanceof RedirectCidError)) {
          throw e
        }

        expect(e.newUrl).toEqual(`http://${MANIFEST.cid}.bzz.link/`)
      }
    })

    it('should throw when CID support is disabled', async () => {
      const router = routerClosure('http://some.bee', false, true)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`${MANIFEST.cid}.bzz.link`)

      expect(() => router(req)).toThrow(NotEnabledError)
    })

    it('should throw when ENS support is disabled', async () => {
      const router = routerClosure('http://some.bee', true, false)
      const req = Substitute.for<Request>()
      req.hostname.returns!(`some-ens.bzz.link`)

      expect(() => router(req)).toThrow(NotEnabledError)
    })
  })
})
