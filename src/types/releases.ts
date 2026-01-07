// GitHub Release API types
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface GitHubAsset {
    url: string;
    id: number;
    name: string;
    label: string;
    uploader: GitHubUser;
    content_type: string;
    state: string;
    size: number;
    digest: string;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
}

export interface GitHubRelease {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    author: GitHubUser;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    draft: boolean;
    immutable: boolean;
    prerelease: boolean;
    created_at: string;
    updated_at: string;
    published_at: string;
    assets: GitHubAsset[];
    tarball_url: string;
    zipball_url: string;
    body: string;
}

// Processed download types
export interface ProcessedAsset {
    platform: string;
    platformName: string;
    fileName: string;
    size: string;
    url: string;
    sha256: string;
    icon: string;
    color: string;
}

export interface ReleaseData {
    success: boolean;
    version: string;
    releaseName: string;
    releaseNotes: string;
    publishedAt: string;
    downloads: ProcessedAsset[];
}

export interface DownloadLink extends ProcessedAsset {
    name: string;
    iconElement: React.ReactElement;
}
