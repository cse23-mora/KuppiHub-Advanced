import { NextResponse } from 'next/server';
import { fetchLatestRelease, processReleaseAssets } from '@/lib/github-releases';

export async function GET() {
    try {
        const release = await fetchLatestRelease();
        const downloads = processReleaseAssets(release.assets);

        return NextResponse.json({
            success: true,
            version: release.tag_name,
            releaseName: release.name,
            releaseNotes: release.body,
            publishedAt: release.published_at,
            downloads,
        });
    } catch (error) {
        console.error('Error fetching GitHub release:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch release data'
            },
            { status: 500 }
        );
    }
}
