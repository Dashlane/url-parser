import { parse } from 'tldts';

const protocols: string[] = [
    'http://',
    'https://',
    'ftp://',
    'file://',
    'afp://',
    'smb://'
];

function domainIsIPv4(hostname: string): boolean {
    if (!hostname) {
        return false;
    }
    // ex with an url http://54.77.248.115.google.com
    // hostname 54.77.248.115
    const hostnameParts = hostname.split('.');
    if (isNaN(parseInt(hostnameParts[hostnameParts.length - 1], 10))) {
        return false;
    } else {
        // ensure valid IP format (basic test)
        return (hostnameParts.length === 4) && hostnameParts.every((domainPart: string) => {
            const byte = parseInt(domainPart, 10);
            return !isNaN(byte) && byte <= 255;
        });
    }
}

function domainIsIPv6(hostname: string): boolean {
    if (!hostname) {
        return false;
    }
    // ex with an url http://[1080:0:0:0:8:800:200C:417A]
    // hostname 1080:0:0:0:8:800:200C:417A
    const hostnameParts = hostname.split(':');
    const checkFormat = hostnameParts.length >= 4 &&   // [2001:db8::1] is a valid IPv6 address and equal to [2001:db8:0:1:0:0:0:0]
        hostnameParts.length <= 8;

    const checkBytes = hostnameParts.every((str: string) => {
        if (!str) {
            // In IPv6 protocol, this is a valid IPv6 address: [1080::::8:800:200C:417A]
            str = '0';
        }
        const bytes = parseInt(str, 16);
        return !isNaN(bytes) && bytes <= 0xFFFF;
    });

    return checkFormat && checkBytes;
}

function domainIsIP(hostname: string): boolean {
    if (!hostname) {
        return false;
    }
    return domainIsIPv4(hostname) || domainIsIPv6(hostname);
}

export function extractFilepathFromUrl(url: string): string {
    if (!url) {
        return null;
    }
    let ret = extractFullFilepathFromUrl(url);
    // Strip the querystrings
    return ret.split('?')[0];
}

export function extractFullFilepathFromUrl(url: string): string {
    if (!url) {
        return null;
    }
    let ret: string = url;

    const protocol = findUsedProtocol(url);
    if (protocol) {
        ret = url.slice(protocol.length);
        const idx: number = ret.indexOf('/');
        if (idx !== -1) {
            ret = ret.slice(idx);
        }
    }

    return ret;
}
function startWithHttp(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://')
}

export function extractFullDomain(url: string): string {
    if (!url) {
        return null;
    }
    const parsedUrl = parse(url);

    if (domainIsIP(parsedUrl.hostname) // the url is an IP address
        || parsedUrl.hostname === 'localhost' // the url is a localhost
        || parsedUrl.hostname === parsedUrl.publicSuffix && startWithHttp(url)) { // the url has no extension but still start with 'http' (ex. http://url-without-extension)
        return parsedUrl.hostname;
    }
    if (parsedUrl.subdomain) {
        return `${parsedUrl.subdomain}.${parsedUrl.domain}`
    }
    if (parsedUrl.domain) {
        return parsedUrl.domain;
    }

    return null;
}

export function extractNakedDomain(url: string): string {
    const fullDomain = extractFullDomain(url);
    if (!url) {
        return null;
    }
    return fullDomain.replace(/^www\./, '');
}

export function extractRootDomain(url: string): string {
    if (!url) {
        return null;
    }
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) // the url is an IP address
        || parsedUrl.hostname === 'localhost' // the url is a localhost
        || parsedUrl.hostname === parsedUrl.publicSuffix && startWithHttp(url)) { // the url has no extension but still start with 'http' (ex. http://url-without-extension)
        return parsedUrl.hostname;
    }
    if (parsedUrl.domain) {
        return parsedUrl.domain;
    }

    return null;
}

export function extractRootDomainName(url: string): string {
    if (!url) {
        return null;
    }
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) // the url is an IP address
        || parsedUrl.hostname === 'localhost' // the url is a localhost
        || parsedUrl.hostname === parsedUrl.publicSuffix && startWithHttp(url)) { // the url has no extension but still start with 'http' (ex. http://url-without-extension)
        return parsedUrl.hostname;
    }
    if (parsedUrl.domain) {
        if (parsedUrl.publicSuffix) {
            return parsedUrl.domain.substring(0, parsedUrl.domain.indexOf(`.${parsedUrl.publicSuffix}`));
        }
        return parsedUrl.domain;
    }

    return null;
}

export function extractSubDomainName(url: string): string {
    if (!url) {
        return null;
    }
    const parsedUrl = parse(url);
    const subdomain = parsedUrl.subdomain;

    if (!subdomain || subdomain === 'www') {
        return null;
    }
    return subdomain;
}

export function extractUrlHash(url: string): string {
    if (!url) {
        return null;
    }
    const idx = url.indexOf('#') + 1;
    const hash = url.slice(idx);
    if (url === hash) {
        return null;
    }
    return hash;
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
    if (!url) {
        return false;
    }
    const { hostname } = parse(url);
    return domainIsIPv4(hostname);
}

export function isUrlWithIPv6(url: string): boolean {
    if (!url) {
        return false;
    }
    const { hostname } = parse(url);
    return domainIsIPv6(hostname);
}


export function isUrlWithIP(url: string): boolean {
    if (!url) {
        return false;
    }
    const { hostname } = parse(url);
    return domainIsIP(hostname);
}

export function isUrlWithDomain(url: string): boolean {
    if (!url) {
        return false;
    }

    const { domain } = parse(url);
    return Boolean(domain);
}

export function isUrl(url: string): boolean {
    return isUrlWithDomain(url) || isUrlWithIP(url);
}

/**
 * Finds the protocol with which the URL starts from a predefined list of the possible protocols
 */
export function findUsedProtocol(url: string): string | undefined {
    return protocols.find(protocol => url.startsWith(protocol));
}

/**
 * Loose check if the URL starts with one of the known protocols [http://, https://, ftp://, file://, afp://, smb://]
 * This method does not strictly check the validity of a URL
 * If you need to check the validity of the URL please refer to isUrl method
 */
export function urlContainsProtocol(url: string): boolean {
    if (!url) {
        return false;
    }

    return findUsedProtocol(url) !== undefined;
}

/**
 * Omits the query string from a URL
 * Examples :
 * http://example.com/over/there?name=ferret -> http://example.com/over/there
 * http://example.com/path/to/page?name=ferret&color=purple -> http://example.com/path/to/page
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
