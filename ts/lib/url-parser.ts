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
        return (hostnameParts.length === 4) && hostnameParts.every( (domainPart: string) => {
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

    const checkBytes = hostnameParts.every( (str: string) => {
        if (!str) {
            // In IPv6 protocol, this is a valid IPv6 address: [1080::::8:800:200C:417A]
            str = '0';
        };
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
        return '';
    }
    let ret = extractFullFilepathFromUrl(url);
    // Strip the querystrings
    return ret.split('?')[0];
}

export function extractFullFilepathFromUrl(url: string): string {
    if (!url) {
        return '';
    }
    let ret: string = url;

    for (let i = 0; i < protocols.length; i++) {
        const p = protocols[i];
        if (url.indexOf(p) === 0) {
            ret = url.slice(p.length);
            const idx: number = ret.indexOf('/');
            if (idx !== -1) {
                ret = ret.slice(idx);
            }
            break;
        }
    }
    return ret;
}

export function extractFullDomain(url: string): string {
    if (!url) {
        return '';
    }
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else {
        if (parsedUrl.subdomain && parsedUrl.domain) {
            return `${parsedUrl.subdomain}.${parsedUrl.domain}`
        } else {
            return parsedUrl.domain || '';
        }
    }
}
export function extractNakedDomain(url: string): string {
    const fullDomain = extractFullDomain(url);
    if (!url) {
        return '';
    }
    return fullDomain.replace(/^www\./, '');
}

export function extractRootDomain(url: string): string {
    if (!url) {
        return '';
    }
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else {
        return parsedUrl.domain || '';
    }
}

export function extractRootDomainName(url: string): string {
    if (!url) {
        return '';
    }
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else if (parsedUrl.publicSuffix && parsedUrl.domain) {
        return parsedUrl.domain
            .substring(0, parsedUrl.domain.indexOf(`.${parsedUrl.publicSuffix}`))
    } else {
        return parsedUrl.domain || '';
    }
}

export function extractSubDomainName(url: string): string {
    if (!url) {
        return '';
    }
    const parsedUrl = parse(url);
    const subdomain = parsedUrl.subdomain;

    if (!subdomain || subdomain === 'www') {
        return '';
    }
    return subdomain;
}

export function extractUrlHash(url: string): string {
    if (!url) {
        return '';
    }
    const idx = url.indexOf('#') + 1;
    const hash = url.slice(idx)
    if (url === hash) {
        return '';
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
        url: url || '',
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
    const urlRegexps = [
        /^(?:https?:\/\/)?(?:[a-z0-9\-_]{1,63}\.)+(?:[a-z0-9\-_]{1,63})(?::[0-9]{1,5})?(?:\/.*)?$/i,
        /^(?:https?:\/\/)?(?:[a-z0-9\-_]{1,63})(?::[0-9]{1,5})?(?:\/.*)?$/i,
        /^(?:https?:\/\/)?(?:[a-z0-9\-_]{1,63}\.)+(?:[a-z0-9\-_]{1,63})(?::[0-9]{1,5})?\s*$/i,
        /^(?:https?:\/\/)?(?:[a-z0-9\-_]{1,63})(?::[0-9]{1,5})?\s*$/i,
    ];
    const urlRegex: RegExp = /^(?:https?:\/\/)?(?:[a-z0-9\\-_]{1,63}\\.)+(?:[a-z0-9\\-_]{1,63})(?::[0-9]{1,5})?(?:\/.*)?$/i;
    return urlRegexps.some(urlRegexp => url.match(urlRegexp) !== null) && !isUrlWithIP(url);
}

export function isUrl(url: string): boolean {
    return isUrlWithDomain(url) || isUrlWithIP(url);
}
