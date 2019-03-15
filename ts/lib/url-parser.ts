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

function domainIsIP(url: string): boolean {
    const hostname = parse(url).hostname;
    return domainIsIPv4(hostname) || domainIsIPv6(hostname);
}

export function extractFilepathFromUrl(url: string): string {
    let ret = extractFullFilepathFromUrl(url);
    // Strip the querystrings
    return ret.split('?')[0];
}

export function extractFullFilepathFromUrl(url: string): string {
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
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname)  || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else {
        if(parsedUrl.subdomain) {
            return `${parsedUrl.subdomain}.${parsedUrl.domain}`
        } else {
            return parsedUrl.domain;
        }
    }
}

export function extractNakedDomain(url: string): string {
    const fullDomain = extractFullDomain(url);
    return fullDomain.replace(/^www\./, '');
}

export function extractRootDomain(url: string): string {
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname)  || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else {
        return parsedUrl.domain;
    }
}

export function extractRootDomainName(url: string): string {
    const parsedUrl = parse(url);
    if (domainIsIP(parsedUrl.hostname) || parsedUrl.hostname === 'localhost') {
        return parsedUrl.hostname;
    } else {
        return (parsedUrl.publicSuffix && parsedUrl.domain) ?
            parsedUrl.domain.substring(0, parsedUrl.domain.indexOf(`.${parsedUrl.publicSuffix}`)) :
            parsedUrl.domain;
    }
}

export function extractSubDomainName(url: string): string {
    const parsedUrl = parse(url);
    const subdomain = parsedUrl.subdomain;

    if (!subdomain || subdomain === 'www') {
        return null;
    }
    return subdomain;
}

export interface ParsedUrl {
    url: string;
    fullDomain: string;
    rootDomain: string;
    rootDomainName: string;
    subDomainName: string;
}

export function getParsedUrl(url: string): ParsedUrl {
    return {
        url: url,
        fullDomain: extractFullDomain(url),
        rootDomain: extractRootDomain(url),
        rootDomainName: extractRootDomainName(url),
        subDomainName: extractSubDomainName(url),
    };
}

export function isUrlWithIPv4(url: string): boolean {
    const { hostname } = parse(url);
    return domainIsIPv4(hostname);
}

export function isUrlWithIPv6(url: string): boolean {
    const { hostname } = parse(url);
    return domainIsIPv6(hostname);
}


export function isUrlWithIP(url: string): boolean {
    const { hostname } = parse(url);
    return domainIsIP(hostname);
}

export function isUrlWithDomain(url: string): boolean {
    // Regexps from the C++ file Desktop/CppLibrairies/SourceCode/KWMacUI/UI Applet/Tools/URLValidator.m
    // Used in C++ in the function isValidUrlOrIP(url) to validate datacapture of a URL
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
