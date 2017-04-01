import response from './response'

export default async (ctx, next) => {

  ctx.schema = ctx.request.url.split('/')[1]
  
  await next()

}
