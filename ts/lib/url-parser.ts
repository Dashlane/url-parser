import {parse, getDomain, getHostname, getDomainWithoutSuffix, getSubdomain} from 'tldts';

export function extractFilepathFromUrl(url: string): string {
    let ret = extractFullFilepathFromUrl(url);
    // Strip the querystrings (/!\ and the hash if there's a querystring)
    return ret?.split('?')[0] || null;
}

/**
 * https://hello.com/path?query#hash => /path?query#hash
 * hello.com/path?query#hash => hello.com/path?query#hash
 * https://hello.com => hello.com
 */
export function extractFullFilepathFromUrl(url: string): string {
    const protocol = findUsedProtocol(url);
    if (protocol) {
        const urlWithoutProtocol = url.slice(protocol.length);
        const idx: number = urlWithoutProtocol.indexOf('/');
        if (idx !== -1) {
            return urlWithoutProtocol.slice(idx);
        }
        return urlWithoutProtocol;
    }

    return url || null;
}

export function extractFullDomain(url: string): string {
    return getHostname(url) || null;
}

export function extractNakedDomain(url: string): string {
    return getHostname(url)?.replace(/^www\./, '')  || null;
}

export function extractRootDomain(url: string): string {
    return getDomain(url) || getHostname(url) || null;
}

export function extractRootDomainName(url: string): string {
    return getDomainWithoutSuffix(url) || extractRootDomain(url);
}

export function extractSubDomainName(url: string): string {
    const subdomain = getSubdomain(url);
    return (subdomain && subdomain !== 'www') ? subdomain : null;
}

export function extractUrlHash(url: string): string {
    if (!url) {
        return null;
    }
    const idx = url.indexOf('#') + 1;
    if (idx === 0) {
        return null;
    }
    return url.slice(idx);
}

export interface ParsedUrl {
    url: string;
    fullDomain: string;
    rootDomain: string;
    rootDomainName: string;
    subDomainName: string;
    urlHash: string;
}

export function getParsedUrl(url: string): ParsedUrl {
    return {
        url: url,
        fullDomain: extractFullDomain(url),
        rootDomain: extractRootDomain(url),
        rootDomainName: extractRootDomainName(url),
        subDomainName: extractSubDomainName(url),
        urlHash: extractUrlHash(url)
    };
}

export function isUrlWithIPv4(url: string): boolean {
    const parsed = parse(url);
    return Boolean(parsed.isIp && !parsed.hostname?.includes(':'));
}

export function isUrlWithIPv6(url: string): boolean {
    const parsed = parse(url);
    return Boolean(parsed.isIp && parsed.hostname?.includes(':'));
}

export function isUrlWithIP(url: string): boolean {
    return Boolean(parse(url).isIp);
}

export function isUrlWithDomain(url: string): boolean {
    return Boolean(getDomain(url));
}

export function isUrl(url: string): boolean {
    const parsedURL = parse(url);
    return Boolean(parsedURL.domain || parsedURL.isIp || parsedURL.hostname === 'localhost');
}

/**
 * Finds the protocol with which the URL starts from a predefined list of the possible protocols
 */
export function findUsedProtocol(url: string): string | undefined {
    try {
        return new URL(url).protocol + '//';
    } catch (error) {
        if (error instanceof TypeError) {
            return undefined; // not a valid URL
        }
        throw error;
    }
}

/**
 * Check if the URL starts with a protocol
 */
export function urlContainsProtocol(url: string): boolean {
    return findUsedProtocol(url) !== undefined;
}

/**
 * Omits the query string from a URL
 * Examples :
 * http://example.com/over/there?name=ferret -> http://example.com/over/there
 * http://example.com/path/to/page?name=ferret&color=purple -> http://example.com/path/to/page
 * /!\ it potentially removes the hash if there's one after the query string
 */
export function omitQueryStringFromUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    const queryStringStart = url.indexOf('?');
    if (queryStringStart < 0) {
        return url;
    }

    return url.slice(0, queryStringStart);
}

/**
 * Omits the credentials from URLs with the following format : http://username:password@example.com
 * Example: http://username:password@example.com -> http://example.com
 */
export function omitCredentialsFromUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    const separatorIndex = url.indexOf('@');
    if (separatorIndex < 0) {
        return url;
    }

    const protocol = findUsedProtocol(url);
    const domain = url.slice(separatorIndex + 1);

    return `${protocol}${domain}`;
}
