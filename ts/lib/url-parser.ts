
const protocols: string[] = [
    'http://',
    'https://',
    'ftp://',
    'file://',
    'afp://',
    'smb://'
];

const multiExtensionsPrefix: string[] = [
    'co',
    'com',
    'fr',
    'ac',
    'gov',
    'org',
    'edu',
    'net',
    'gob',
];

const multiExtensions: string[] = [
    // UK multi-extensions
    'judiciary.uk',
    'ltd.uk',
    'me.uk',
    'mod.uk',
    'nhs.uk',
    'nic.uk',
    'parliament.uk',
    'plc.uk',
    'sch.uk',
    'bl.uk',
    'jet.uk',
    'british-library.uk',
    'nls.uk',

    // Canadian provincial domains
    // https://en.wikipedia.org/wiki/.ca#Third-level_.28provincial.29_and_fourth-level_.28municipal.29_domains
    'ab.ca',
    'bc.ca',
    'mb.ca',
    'nb.ca',
    'nf.ca',
    'nl.ca',
    'ns.ca',
    'nt.ca',
    'nu.ca',
    'on.ca',
    'pe.ca',
    'qc.ca',
    'sk.ca',
    'yk.ca',
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
            const byte = parseInt(domainPart, 10);
            return !isNaN(byte) && byte <= 255;
        });
    }
}

function domainIsIPv6(domainParts: string[]): boolean {
    // ex with url = 'http://[1080:0:0:0:8:800:200C:417A]'
    // domainParts = [ '[1080:0:0:0:8:800:200C:417A]' ]
    var ipv6 = domainParts[0];
    const checkFormat = domainParts.length === 1 &&
           ipv6[0] === '[' &&
           ipv6[ ipv6.length - 1] === ']' &&
           ipv6.split(':').length >= 4 &&   // [2001:db8::1] is a valid IPv6 address and equal to [2001:db8:0:1:0:0:0:0]
           ipv6.split(':').length <= 8;

    const checkBytes = ipv6.slice(1, ipv6.length-1).split(':').every( (str: string) => {
        if (!str) {
            // In IPv6 protocol, this is a valid IPv6 address: [1080::::8:800:200C:417A]
            str = '0';
        };
        const bytes = parseInt(str, 16);
        return !isNaN(bytes) && bytes <= 0xFFFF;
    });

    return checkFormat && checkBytes;
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
    } else if (multiExtensionsPrefix.indexOf(domainParts[domainParts.length - 2]) !== -1) {
        domainParts = domainParts.slice(domainParts.length - 3);
    } else if (multiExtensions.indexOf(domainParts.slice(domainParts.length - 2).join('.')) !== -1) {
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

export function extractSubDomainName(url: string): string {
    const subDomainName = extractFullDomain(url)
        .replace(extractRootDomain(url), '')
        .replace(/\.$/, '');
    if (!subDomainName || subDomainName === 'www') {
        return null;
    }
    return subDomainName;
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
    const domain: string = extractFullDomain(url);
    let domainParts: string[] = domain.split('.');
    return domainIsIPv4(domainParts);
}

export function isUrlWithIPv6(url: string): boolean {
    const domain: string = extractFullDomain(url);
    let domainParts: string[] = domain.split('.');
    return domainIsIPv6(domainParts);
}

export function isUrlWithIP(url: string): boolean {
    const domain: string = extractFullDomain(url);
    let domainParts: string[] = domain.split('.');
    return domainIsIP(domainParts);
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
