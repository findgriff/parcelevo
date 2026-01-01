/* apps/console/src/app/healthz/route.ts */
export const dynamic = 'force-static';
export function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'content-type': 'application/json' },
  });
}
