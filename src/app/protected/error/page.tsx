export const dynamic = 'force-dynamic'

export default function Page() {
  console.log('LOC OOIIII')
  throw new Error('Test error from protected error page')

  return <div>Page</div>
}
