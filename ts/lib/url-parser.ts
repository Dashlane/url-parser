
const protocols: string[] = [
    'http://',
    'https://',
    'ftp://',
    'file://',
    'afp://',
    'smb://'
];

const multiExtensions: string[] = [
    'co',
    'com',
    'fr',
    'ac',
    'gov',
    'org',
    'edu',
    'net',
];

function domainIsIPv4(domainParts: string[]): boolean {
    // ex with url = 'http://54.77.248.115.google.com'
    // domainParts = [ '54', '77', '248', '115', 'google', 'com' ]
    // => not an IP
    if (isNaN(parseInt(domainParts[domainParts.length - 1], 10))) {
        return false;
    } else {
        // ensure valid IP format (basic test)
        return (domainParts.length === 4) && domainParts.every( (domainPart: string) => {
            return !isNaN(parseInt(domainPart, 10));
        });
    }
}

function domainIsIPv6(domainParts: string[]): boolean {
    // ex with url = 'http://[1080:0:0:0:8:800:200C:417A]'
    // domainParts = [ '[1080:0:0:0:8:800:200C:417A]' ]
    var ipv6 = domainParts[0];
    return domainParts.length === 1 &&
           ipv6[0] === '[' &&
           ipv6[ ipv6.length - 1] === ']' &&
           ipv6.split(':').length === 8;
}

function domainIsIP(domainParts: string[]): boolean {
    return domainIsIPv4(domainParts) || domainIsIPv6(domainParts);
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
    let ret: string = url;

    // Strip the protocol
    for (let i = 0; i < protocols.length; i++) {
        const p = protocols[i];
        if (url.indexOf(p) === 0) {
            ret = url.slice(p.length);
            break;
        }
    }

    // Strip trailing path
    const idx: number = ret.indexOf('/');
    if (idx !== -1) {
        ret = ret.slice(0, idx);
    }

    // Strip port safely (avoid collision with ipv6)
    const splitBySemicolon = ret.split(':');
    const portCandidate = splitBySemicolon[ splitBySemicolon.length - 1 ];
    if (portCandidate.match(/^[0-9]+$/)) {
        splitBySemicolon.pop(); // remove port
        ret = splitBySemicolon.join(':');
    }

    return ret;
}

export function extractRootDomain(url: string): string {
    const domain: string = extractFullDomain(url);

    let domainParts: string[] = domain.split('.');

    if (domainIsIP(domainParts)) {
        return domainParts.join('.');
    }

    if (domainParts.length <= 2) {
        return domain;
    } else if (multiExtensions.indexOf(domainParts[domainParts.length - 2]) !== -1) {
        domainParts = domainParts.slice(domainParts.length - 3);
    } else {
        domainParts = domainParts.slice(domainParts.length - 2);
    }
    return domainParts.join('.');
}

export function extractRootDomainName(url: string): string {
    const rootDomain: string = extractRootDomain(url);
    const domainParts: string[] = rootDomain.split('.');

    if (domainIsIP(domainParts)) {
        return rootDomain;
    } else {
        return domainParts[0];
    }
}

export interface ParsedUrl {
    url: string;
    fullDomain: string;
    rootDomain: string;
    rootDomainName: string;
}

export function getParsedUrl(url: string): ParsedUrl {
    return {
        url: url,
        fullDomain: extractFullDomain(url),
        rootDomain: extractRootDomain(url),
        rootDomainName: extractRootDomainName(url)
    };
}

