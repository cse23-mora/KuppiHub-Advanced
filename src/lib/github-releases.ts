import { GitHubRelease, GitHubAsset, ProcessedAsset } from '@/types/releases';

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'Kuppihub';
const REPO_NAME = 'Kuppihub-APP';

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Map asset file names to platform information
 */
function getAssetPlatformInfo(fileName: string): {
    platform: string;
    platformName: string;
    icon: string;
    color: string;
} | null {
    if (fileName.includes('composeApp-release.apk')) {
        return {
            platform: 'Android',
            platformName: 'Android',
            icon: 'android',
            color: '#3DDC84',
        };
    } else if (fileName.includes('.dmg')) {
        return {
            platform: 'macOS',
            platformName: 'macOS',
            icon: 'apple',
            color: '#000000',
        };
    } else if (fileName.includes('.msi')) {
        return {
            platform: 'Windows',
            platformName: 'Windows',
            icon: 'windows',
            color: '#0078D4',
        };
    } else if (fileName.includes('.deb')) {
        return {
            platform: 'Linux',
            platformName: 'Linux (Debian/Ubuntu)',
            icon: 'linux',
            color: '#E95420',
        };
    }
    return null;
}

/**
 * Process GitHub release assets to our ProcessedAsset format
 */
export function processReleaseAssets(assets: GitHubAsset[]): ProcessedAsset[] {
    const downloads: ProcessedAsset[] = [];

    assets.forEach((asset) => {
        const platformInfo = getAssetPlatformInfo(asset.name);
        if (platformInfo) {
            downloads.push({
                ...platformInfo,
                fileName: asset.name,
                size: formatFileSize(asset.size),
                url: asset.browser_download_url,
                sha256: asset.digest ? asset.digest.replace('sha256:', '') : '',
            });
        }
    });

    return downloads;
}

/**
 * Fetch the latest release from GitHub
 */
export async function fetchLatestRelease(): Promise<GitHubRelease> {
    const url = `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
    
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            // Optional: Add GitHub token if rate limiting becomes an issue
            // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        },
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Get GitHub repository URL
 */
export function getRepositoryUrl(): string {
    return `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
}

/**
 * Get GitHub releases page URL
 */
export function getReleasesPageUrl(): string {
    return `${getRepositoryUrl()}/releases`;
}

/**
 * Get GitHub latest release URL
 */
export function getLatestReleaseUrl(): string {
    return `${getRepositoryUrl()}/releases/latest`;
}
