import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Revalidate API called')
    
    const { paths } = await request.json()
    console.log('Paths to revalidate:', paths)

    if (!Array.isArray(paths)) {
      console.error('Invalid paths provided:', paths)
      return NextResponse.json(
        { message: 'Invalid paths' },
        { status: 400 }
      )
    }

    // 重新验证所有提供的路径
    for (const path of paths) {
      console.log('Revalidating path:', path)
      revalidatePath(path)
    }

    console.log('Revalidation completed successfully')
    return NextResponse.json({ revalidated: true, now: Date.now(), paths })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error in revalidate API:', err)
    return NextResponse.json(
      { message: 'Error revalidating', error: errorMessage },
      { status: 500 }
    )
  }
} 