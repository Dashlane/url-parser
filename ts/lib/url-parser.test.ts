import * as should from 'should';

import * as UrlUtils from './url-parser';

describe('UrlUtils', () => {

    describe('extractFilepathFromUrl', () => {

        it('should return the original string if it does not begin with a known protocol', () => {
            const url = 'toto/toto/totooooo';
            UrlUtils.extractFilepathFromUrl(url).should.eql(url);
        });

        it('should return only the part of the url that is after the first slash', () => {
            const url = 'http://toto.com/a/b/c/url/lol.png';
            UrlUtils.extractFilepathFromUrl(url).should.eql('/a/b/c/url/lol.png');
        });

        it('should correctly extract the file path with known protocols', () => {
            const base = '/my/toto/images/latete.jpg';
            const domain = 'toto.com';
            UrlUtils.extractFilepathFromUrl(`http://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`https://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`ftp://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`file://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`afp://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`smb://${domain}${base}`).should.eql(base);
        });

        it('should return the whole urls with unknown protocols', () => {
            const url = 'toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractFilepathFromUrl(`unmht://${url}`).should.eql(`unmht://${url}`);
            UrlUtils.extractFilepathFromUrl(`toto://${url}`).should.eql(`toto://${url}`);
        });

        it('should just return an empty string if the first slash is also the last character', () => {
            const url = 'http://toto.com/';
            UrlUtils.extractFilepathFromUrl(url).should.eql('/');
        });

        it('should correctly parse an IP-based url', () => {
            const url = 'http://54.77.248.115:8080/page/index.html';
            UrlUtils.extractFilepathFromUrl(url).should.eql('/page/index.html');
        });

        it('should correctly parse an url with querystring', () => {
            const url = 'http://toto.com/index.html?query=string&param=1';
            UrlUtils.extractFilepathFromUrl(url).should.eql('/index.html');
        });

        it('should return null if the url is null', () => {
            (UrlUtils.extractFilepathFromUrl(null) === null).should.be.True();
        });

        it('should return null if the url is empty', () => {
            (UrlUtils.extractFilepathFromUrl('') === null).should.be.True();
        });

    });

    describe('extractFullFilepathFromUrl', () => {
        it('should correctly parse an url with querystring', () => {
            const url = 'http://toto.com/index.html?query=string&param=1';
            UrlUtils.extractFullFilepathFromUrl(url).should.eql('/index.html?query=string&param=1');
        });

        it('should correctly parse a relative URL with querystring', () => {
            const url = '/index.html?query=string&param=1';
            UrlUtils.extractFullFilepathFromUrl(url).should.eql('/index.html?query=string&param=1');
        });

        it('should correctly parse a relative url with a complex querystring', () => {
            const url = '/account/forgotpassword/?layout=Standard&amp;loginReferrerUrl=https%3A%2F%2Fwww.allrecipes.com%2F';
            UrlUtils.extractFullFilepathFromUrl(url).should.eql('/account/forgotpassword/?layout=Standard&amp;loginReferrerUrl=https%3A%2F%2Fwww.allrecipes.com%2F');
        });

        it('should correctly parse an url with a complex querystring', () => {
            const url = 'http://www.allrecipes.com/account/forgotpassword/?layout=Standard&amp;loginReferrerUrl=https%3A%2F%2Fwww.allrecipes.com%2F';
            UrlUtils.extractFullFilepathFromUrl(url).should.eql('/account/forgotpassword/?layout=Standard&amp;loginReferrerUrl=https%3A%2F%2Fwww.allrecipes.com%2F');
        });

        it('should return null if the url is null', () => {
            (UrlUtils.extractFullFilepathFromUrl(null) === null).should.be.True();
        });

        it('should return null if the url is empty', () => {
            (UrlUtils.extractFullFilepathFromUrl('') === null).should.be.True();
        });

    });

    describe('extractRootDomain', () => {

        it('should extract the domain where its equal to the hostname', () => {
            const url = 'http://toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractRootDomain(url).should.eql('toto.com');
        });

        it('should extract the domain when the hostname is funky', () => {
            const url = 'http://www2.toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractRootDomain(url).should.eql('toto.com');
        });

        it('should extract the domain when there are no "www"', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            UrlUtils.extractRootDomain(url).should.eql('amazonaws.com');
        });

        it('should extract the domain when theres no trailing path', () => {
            const url = 'http://www.google.com';
            UrlUtils.extractRootDomain(url).should.eql('google.com');
        });

        it('should extract the domain when there is no http but there is a trailing path', () => {
            const url = 'www.domain3.co.uk/connect';
            UrlUtils.extractRootDomain(url).should.eql('domain3.co.uk');
        });

        it('should extract the domain but discard the port', () => {
            const url = 'http://parml20.dashlane.com:8000/login_std.html';
            UrlUtils.extractRootDomain(url).should.eql('dashlane.com');
        });

        it('should extract the domain when it has multi-extensions', () => {
            const url1 = 'www.domain3.gov.uk';
            UrlUtils.extractRootDomain(url1).should.eql('domain3.gov.uk');
            const url2 = 'www.domain3.qc.ca';
            UrlUtils.extractRootDomain(url2).should.eql('domain3.qc.ca');
            const url3 = 'www.city.takayama.gifu.jp';
            UrlUtils.extractRootDomain(url3).should.eql('city.takayama.gifu.jp');
            const url4 = 'https://www.impots.gouv.fr';
            UrlUtils.extractRootDomain(url4).should.eql('impots.gouv.fr');
        });

        it('should return null when the domain is null', () => {
            (UrlUtils.extractRootDomain(null) === null).should.be.True();
        });

        it('should return null when the domain is an empty string', () => {
            (UrlUtils.extractRootDomain('') === null).should.be.True();
        });

    });

    describe('extractRootDomainName', () => {

        it('should work with standard urls', () => {
            const url = 'http://www.toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractRootDomainName(url).should.eql('toto');
        });

        it('should work with subdomains and when there is no www', () => {
            const url = 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2365-6/_n.png';
            UrlUtils.extractRootDomainName(url).should.eql('akamaihd');
            const url2 = 'https://online.citibank.com/US/Welcome.c';
            UrlUtils.extractRootDomainName(url2).should.eql('citibank');
        });

        it('should extract the domain name when there is no trailing path', () => {
            const url = 'http://www.google.com';
            UrlUtils.extractRootDomainName(url).should.eql('google');
        });

        it('should extract the domain name when it has multi-extensions', () => {
            const url1 = 'www.domain3.gov.uk';
            UrlUtils.extractRootDomainName(url1).should.eql('domain3');
            const url2 = 'www.city.takayama.gifu.jp';
            UrlUtils.extractRootDomainName(url2).should.eql('city');
            const url3 = 'https://www.impots.gouv.fr';
            UrlUtils.extractRootDomainName(url3).should.eql('impots');
        });

        it('should return null when the domain is null', () => {
            (UrlUtils.extractRootDomainName(null) === null).should.be.True();
        });

        it('should return null when the domain is an empty string', () => {
            (UrlUtils.extractRootDomainName('') === null).should.be.True();
        });

    });

    describe('extractFullDomain', () => {

        it('should include the www in the fulldomain', () => {
            const url = 'http://www.lolerz.com/my/toto/images/latete.jpg';
            UrlUtils.extractFullDomain(url).should.eql('www.lolerz.com');
        });

        it('should return the root domain when there is no subdomain', () => {
            const url = 'http://toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractFullDomain(url).should.eql('toto.com');
        });

        it('should include www2 as part of the full domain', () => {
            const url = 'http://www2.toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractFullDomain(url).should.eql('www2.toto.com');
        });

        it('should work when there is no www', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            UrlUtils.extractFullDomain(url).should.eql('s3-eu-west-1.amazonaws.com');
        });

        it('should work when there is no trailing path', () => {
            const url = 'http://accounts.google.com';
            UrlUtils.extractFullDomain(url).should.eql('accounts.google.com');
        });

        it('should extract the full domain but discard the port', () => {
            const url = 'http://parml20.dashlane.com:8000/login_std.html';
            UrlUtils.extractFullDomain(url).should.eql('parml20.dashlane.com');
        });

        it('should extract the full domain name when it has multi-extensions', () => {
            const url1 = 'www.city.takayama.gifu.jp';
            UrlUtils.extractFullDomain(url1).should.eql('www.city.takayama.gifu.jp');
            const url2 = 'https://www.impots.gouv.fr';
            UrlUtils.extractFullDomain(url2).should.eql('www.impots.gouv.fr');
        });

        it('should return null when the url is null', () => {
            (UrlUtils.extractFullDomain(null) === null).should.be.True();
        });

        it('should return null when the url is an empty string', () => {
            (UrlUtils.extractFullDomain('') === null).should.be.True();
        });


    });

    describe('extractNakedDomain', () => {

        it('should strip the www in the nakedDomain', () => {
            const url = 'http://www.lolerz.com/my/toto/images/latete.jpg';
            UrlUtils.extractNakedDomain(url).should.eql('lolerz.com');
        });

        it('should include the www2 in the nakedDomain', () => {
            const url = 'http://www2.toto.com/my/toto/images/latete.jpg';
            UrlUtils.extractNakedDomain(url).should.eql('www2.toto.com');
        });

        it('should return the full domain when there is no www', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            UrlUtils.extractNakedDomain(url).should.eql('s3-eu-west-1.amazonaws.com');
        });

        context('when www is not the first subdomain', () => {
            it('should include the www in the nakedDomain', () => {
                const url = 'http://subdomain.www.toto.com/my/toto/images/latete.jpg';
                UrlUtils.extractNakedDomain(url).should.eql('subdomain.www.toto.com');
            });
        });

        it('should return null when the domain is null', () => {
            (UrlUtils.extractNakedDomain(null) === null).should.be.True();
        });

        it('should return null when the domain is an empty string', () => {
            (UrlUtils.extractNakedDomain('') === null).should.be.True();
        });
    });

    describe('extractSubDomainName', () => {
        it('should return null on an url with no subdomain', () => {
            const url = 'http://google.com';
            should.not.exist(UrlUtils.extractSubDomainName(url));
        });
        it('should return null on an url with www subdomain', () => {
            const url = 'http://www.google.com';
            should.not.exist(UrlUtils.extractSubDomainName(url));
        });
        it('should return the subdomain on an url with a subdomain', () => {
            const url = 'http://accounts.google.com';
            UrlUtils.extractSubDomainName(url).should.eql('accounts');
            const url2 = 'http://54.77.248.115.google.com:8080/page/index.html';
            UrlUtils.extractSubDomainName(url2).should.eql('54.77.248.115');
        });
        it('should return null when the domain is null', () => {
            (UrlUtils.extractSubDomainName(null) === null).should.be.True();
        });
        it('should return null when the domain is an empty string', () => {
            (UrlUtils.extractSubDomainName('') === null).should.be.True();
        });
    });

    describe('extractUrlHash', () => {

        it('should return null on a url with no hash', () => {
            const url = 'http://google.com';
            (UrlUtils.extractUrlHash(url) === null).should.be.True();
        });

        it('should return an empty string on a url with an empty hash', () => {
            const url = 'http://google.com#';
            (UrlUtils.extractUrlHash(url) === '').should.be.True();
        });

        it('should return a url hash on a url with a hash', () => {
            const url = 'http://google.com#hash';
            (UrlUtils.extractUrlHash(url) === 'hash').should.be.True();
        });

    });

    describe('getParsedUrl', () => {

        it('should correctly parse an url', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an url without an extension', () => {
            const url = 'http://url-without-extension/login';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('url-without-extension');
            parsedUrl.rootDomain.should.eql('url-without-extension');
            parsedUrl.rootDomainName.should.eql('url-without-extension');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an url with port', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com:9090/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an url with basic-auth', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an url with querystring', () => {
            const url = 'https://google.com/signin?redirect=%2Fhome';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse a url with a hash', () => {
            const url = 'https://google.com/signin#hash';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
            parsedUrl.urlHash.should.eql('hash');
        });

        it('should correctly parse a url with non-encoded querystring', () => {
            const url = 'https://google.com/signin?redirect=/home';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an IPv4-based url', () => {
            const url = 'http://54.77.248.115:8080/page/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('54.77.248.115');
            parsedUrl.rootDomain.should.eql('54.77.248.115');
            parsedUrl.rootDomainName.should.eql('54.77.248.115');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an weird url with "IPv4-like" subdomain', () => {
            const url = 'http://54.77.248.115.google.com:8080/page/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('54.77.248.115.google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an IPv6-based url with port', () => {
            const url = 'http://[1080:0:0:0:8:800:200C:417A]:8000/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('1080:0:0:0:8:800:200c:417a');
            parsedUrl.rootDomain.should.eql('1080:0:0:0:8:800:200c:417a');
            parsedUrl.rootDomainName.should.eql('1080:0:0:0:8:800:200c:417a');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an IPv6-based url', () => {
            const url = 'http://[1080:0:0:0:8:800:200C:417A]/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('1080:0:0:0:8:800:200c:417a');
            parsedUrl.rootDomain.should.eql('1080:0:0:0:8:800:200c:417a');
            parsedUrl.rootDomainName.should.eql('1080:0:0:0:8:800:200c:417a');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should correctly parse an localhost url', () => {
            const url = 'localhost:3003/server?reload=true';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('localhost');
            parsedUrl.rootDomain.should.eql('localhost');
            parsedUrl.rootDomainName.should.eql('localhost');
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should return null when the domain is null', () => {
            const parsedUrl = UrlUtils.getParsedUrl(null);
            (parsedUrl.url === null).should.be.True();
            (parsedUrl.fullDomain === null).should.be.True();
            (parsedUrl.rootDomain === null).should.be.True();
            (parsedUrl.rootDomainName === null).should.be.True();
            (parsedUrl.urlHash === null).should.be.True();
        });

        it('should return null when the domain is an empty string', () => {
            const url = '';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            (parsedUrl.fullDomain === null).should.be.True();
            (parsedUrl.rootDomain === null).should.be.True();
            (parsedUrl.rootDomainName === null).should.be.True();
            (parsedUrl.urlHash === null).should.be.True();
        });
    });

    describe('isUrlWithIPv4', () => {
        it('should return true if input is a URL with IPv4', () => {
            const urls = [
                'http://54.77.248.115:8080/page/index.html',
                'http://54.77.248.115/index.html',
                '54.77.248.115/index.html',
                '54.77.248.115:8080',
                '54.77.248.115',
            ];
            urls.forEach(url => UrlUtils.isUrlWithIPv4(url).should.be.true());
        });
        it('should return false if domain input is not a URL with IPv4', () => {
            const urls = [
                'http://54.77.245:8080/page/index.html',
                'http://[1080:0:0:0:8:800:200C:417A]/index.html',
                'http://54.77.248.115.google.com:8080/page/index.html',
                'https://google.com/signin?redirect=/home',
                'welcome toto',
                'welcome',
                '555.34.54.241',  // IPv4 only goes up to 255
                null,
                ''
            ];
            urls.forEach(url => UrlUtils.isUrlWithIPv4(url).should.be.false());
        });
    });

    describe('isUrlWithIPv6', () => {
        it('should return true if input is a URL with IPv6', () => {
            const urls = [
                'http://[1080:0:0:0:8:800:200C:417A]:8080/page/index.html',
                'http://[1080:0:0:0:8:800:200C:417A]/index.html',
                '[1080:0:0:0:8:800:200C:417A]/index.html',
                '[1080:0:0:0:8:800:200C:417A]:8080',
                '[1080:0:0:0:8:800:200C:417A]',
                '[1080::::8:800:200C:417A]',
                '[2001:db8:a0b:12f0::1]:21',
            ];
            urls.forEach(url => UrlUtils.isUrlWithIPv6(url).should.be.true());
        });
        it('should return false if input is not a URL with IPv6', () => {
            const urls = [
                'http://54.77.248.115/index.html',
                '54.77.248.115:8080',
                'http://[1080:0:0]/index.html',
                'http://[1080:0:0:0:0:0:0:0:0]/index.html',
                'http://54.77.248.115.google.com:8080/page/index.html',
                'https://google.com/signin?redirect=/home',
                'welcome toto',
                'welcome',
                '[1080:0:0:0:8:800:200C:GGGG]',   // GGGG is not hexadecimal
                '[A339D:0:0:0:8:800:200C:417A]',  // IPv6 only goes up to FFFF
                null,
                '',
            ];
            urls.forEach(url => UrlUtils.isUrlWithIPv6(url).should.be.false());
        });
    });

    describe('isUrlWithIP', () => {
        it('should return true if input is a URL with IPv4 or IPv6', () => {
            const urls = [
                'http://[1080:0:0:0:8:800:200C:417A]:8080/page/index.html',
                'http://[1080:0:0:0:8:800:200C:417A]/index.html',
                '[1080:0:0:0:8:800:200C:417A]/index.html',
                '[1080:0:0:0:8:800:200C:417A]:8080',
                '[1080:0:0:0:8:800:200C:417A]',
                'http://54.77.248.115:8080/page/index.html',
                'http://54.77.248.115/index.html',
                '54.77.248.115/index.html',
                '54.77.248.115:8080',
                '54.77.248.115',
            ];
            urls.forEach(url => UrlUtils.isUrlWithIP(url).should.be.true());
        });
        it('should return false if input is not a URL with IPv4 or IPv6', () => {
            const urls = [
                'http://54.77.245:8080/page/index.html',
                'http://[1080:0:0]/index.html',
                'http://54.77.248.115.google.com:8080/page/index.html',
                'https://google.com/signin?redirect=/home',
                'welcome toto',
                'welcome',
                null,
                '',
            ];
            urls.forEach(url => UrlUtils.isUrlWithIP(url).should.be.false());
        });
    });

    describe('isUrlWithDomain', () => {
        it('should return true if input is a URL with a domain', () => {
            const urls = [
                'https://google.com/signin?redirect=/home',
                'http://54.77.248.115.google.com:8080/page/index.html',
                'http://toto.com/a/b/c/url/lol.png',
                'welcome.toto/index.html',
                'welcome.toto',
            ];
            urls.forEach(url => UrlUtils.isUrlWithDomain(url).should.be.true());
        });
        it('should return true if input is not a URL with a domain', () => {
            const urls = [
                'http://54.77.248.115/index.html',
                '54.77.248.115:8080',
                'http://[1080:0:0:0:8:800:200C]/index.html',
                'welcome toto',
                null,
                '',
            ];
            urls.forEach(url => UrlUtils.isUrlWithDomain(url).should.be.false());
        });
    });

    describe('isUrl', () => {
        it('should return true if input is a URL (any kind)', () => {
            const urls = [
                'https://google.com/signin?redirect=/home',
                'http://54.77.248.115.google.com:8080/page/index.html',
                'http://toto.com/a/b/c/url/lol.png',
                'welcome.toto/index.html',
                'welcome.toto',
                'http://54.77.248.115/index.html',
                'http://[1080:0:0:0:8:800:200C:417A]:8080/page/index.html',
            ];
            urls.forEach(url => UrlUtils.isUrl(url).should.be.true());
        });
        it('should return false if input is not a URL (any kind)', () => {
            const urls = [
                'welcome toto',
                'http://[1080:0:0]/index.html',
                '/toto/welcome',
                null,
                ''
            ];
            urls.forEach(url => UrlUtils.isUrl(url).should.be.false());
        });
    });

    describe('findUsedProtocol', () => {
        it('should return the used protocol in the URL', () => {
            const usedProtocols = [
                'http://',
                'ftp://',
                'smb://'
            ];
            const urls = [
                `${usedProtocols[0]}//example.com/over/there`,
                `${usedProtocols[1]}jamesc@ftp.harlequin.com/foo.html`,
                `${usedProtocols[2]}workgroup;user:password@server/share/folder/file.txt`
            ];

            urls.forEach((url, key) => UrlUtils.findUsedProtocol(url)
                .should.eql(usedProtocols[key]))
        });
        it('should return undefined when the url doesn\'t contain a valid protocol', () => {
            const urls = [
                'example.com/page',
                '/path/to/page',
                'http//website.com'
            ];

            urls.forEach((url, key) => should(UrlUtils.findUsedProtocol(url)).be.undefined())
        })
    });

    describe('omitCredentialsFromUrl', () => {
        it('should omit the credentials from urls having the following format http://username:password@example.com', () => {
            UrlUtils.omitCredentialsFromUrl('http://username:password@example.com')
                .should.eql('http://example.com')
        });
    });

    describe('omitQueryStringFromUrl', () => {
        it('should omit the query string from urls', () => {
            const urls = [
                'http://example.com/over/there?name=ferret',
                'http://example.com/path/to/page?name=ferret&color=purple'
            ];
            const expectedOutputs = [
                'http://example.com/over/there',
                'http://example.com/path/to/page'
            ];

            urls.forEach((url, key) => UrlUtils.omitQueryStringFromUrl(url)
                .should.eql(expectedOutputs[key]));
        });
    });

    describe('urlContainsProtocol', () => {
        it('should return true if the url contains a valid protocol', () => {
            const urls = [
                'http://google.com',
                'https://facebook.com',
                'ftp://jamesc@ftp.harlequin.com/foo.html',
                'file://localhost/c$/WINDOWS/clock.avi',
                'afp://;AUTH=No%20User%20Authent@myserver/guestVolume',
                'smb://workgroup;user:password@server/share/folder/file.txt'
            ];

            urls.forEach(url => UrlUtils.urlContainsProtocol(url)
                .should.be.true());
        });

        it('should return false if the url contains a non valid protocol', () => {
            const urls = [
                'example.com/page',
                '/path/to/page',
                'website',
                'http:/website.com',
                'http//website.com',
                'git://github.com/user/project-name.git'
            ];

            urls.forEach(url => UrlUtils.urlContainsProtocol(url)
                .should.be.false());
        });
    });
});
