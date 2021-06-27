import { Headers, flattenHeadersList, headersToList } from 'headers-utils';
import { MockedRequest, MockedResponse, RequestHandler } from 'msw';
import { Application, RequestHandler as Middleware } from 'express';
import { getResponse } from './getResponse';

/**
 * Copied from msw feature proposal
 * https://github.com/mswjs/msw/issues/548#issuecomment-762679369
 */

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

function setupMswMiddleware(app: Application, handlers: RequestHandler[]) {
  const mswMiddleware: Middleware = async (req, res, next) => {
    const headers = new Headers();
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      headers.set(req.rawHeaders[i], req.rawHeaders[i + 1]);
    }
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const newReq: MockedRequest = {
      id: 'test',
      url: new URL(url),
      method: req.method.toUpperCase(),
      headers,
      cookies: req.cookies, // TODO use cookie-parser
      mode: 'same-origin',
      keepalive: false,
      cache: 'default',
      destination: '',
      integrity: '',
      credentials: 'include',
      redirect: 'manual',
      referrer: req.header('referer')!,
      referrerPolicy: '',
      body: req.body as { query: string; variables: Record<string, any> },
      bodyUsed: !!req.body
    };
    const { handler, response } = await getResponse(newReq, handlers);
    if (handler) {
      // MSW Matched Request
      res.status(response!.status);
      flattenHeadersList(headersToList(response?.headers as any)).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      if (response?.delay) {
        await delay(response?.delay);
      }
      res.send(response!.body);
    } else {
      // No MSW match - move along
      next();
    }
  }
  app.use(mswMiddleware);
}

export default setupMswMiddleware;