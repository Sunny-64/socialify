import { isBot } from 'next/dist/server/web/spec-extension/user-agent'
import type { NextRequest } from 'next/server'

import pngEndpoint from '@/pages/api/png'
import svgEndpoint from '@/pages/api/svg'

const imageEndpoint = async (req: NextRequest) => {
  if (isBot(req.headers.get('user-agent') ?? '')) {
    return pngEndpoint(req)
  } else {
    return svgEndpoint(req)
  }
}

export const config = {
  runtime: 'edge',
}

export default imageEndpoint
