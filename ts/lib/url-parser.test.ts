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

        it('should correctly replace all known protocols', () => {
            const base = '/my/toto/images/latete.jpg';
            const domain = 'toto.com';
            UrlUtils.extractFilepathFromUrl(`http://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`https://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`ftp://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`file://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`afp://${domain}${base}`).should.eql(base);
            UrlUtils.extractFilepathFromUrl(`smb://${domain}${base}`).should.eql(base);
        });

        it('should not do anything to urls with unknown protocols', () => {
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
            const url1 = 'www.domain3.judiciary.uk';
            UrlUtils.extractRootDomain(url1).should.eql('domain3.judiciary.uk');
            const url2 = 'www.domain3.qc.ca';
            UrlUtils.extractRootDomain(url2).should.eql('domain3.qc.ca');
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
    });

    describe('getParsedUrl', () => {

        it('should correctly parse an url', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
        });

        it('should correctly parse an url with port', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com:9090/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
        });

        it('should correctly parse an url with basic-auth', () => {
            const url = 'https://s3-eu-west-1.amazonaws.com/dashlane-static-resources/webTesting/signin_prompt.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('s3-eu-west-1.amazonaws.com');
            parsedUrl.rootDomain.should.eql('amazonaws.com');
            parsedUrl.rootDomainName.should.eql('amazonaws');
        });

        it('should correctly parse an url with querystring', () => {
            const url = 'https://google.com/signin?redirect=%2Fhome';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
        });

        it('should correctly parse an url with non-encoded querystring', () => {
            const url = 'https://google.com/signin?redirect=/home';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
        });

        it('should correctly parse an IPv4-based url', () => {
            const url = 'http://54.77.248.115:8080/page/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('54.77.248.115');
            parsedUrl.rootDomain.should.eql('54.77.248.115');
            parsedUrl.rootDomainName.should.eql('54.77.248.115');
        });

        it('should correctly parse an weird url with "IPv4-like" subdomain', () => {
            const url = 'http://54.77.248.115.google.com:8080/page/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('54.77.248.115.google.com');
            parsedUrl.rootDomain.should.eql('google.com');
            parsedUrl.rootDomainName.should.eql('google');
        });

        it('should correctly parse an IPv6-based url with port', () => {
            const url = 'http://[1080:0:0:0:8:800:200C:417A]:8000/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('[1080:0:0:0:8:800:200C:417A]');
            parsedUrl.rootDomain.should.eql('[1080:0:0:0:8:800:200C:417A]');
            parsedUrl.rootDomainName.should.eql('[1080:0:0:0:8:800:200C:417A]');
        });

        it('should correctly parse an IPv6-based url', () => {
            const url = 'http://[1080:0:0:0:8:800:200C:417A]/index.html';
            const parsedUrl = UrlUtils.getParsedUrl(url);
            parsedUrl.url.should.eql(url);
            parsedUrl.fullDomain.should.eql('[1080:0:0:0:8:800:200C:417A]');
            parsedUrl.rootDomain.should.eql('[1080:0:0:0:8:800:200C:417A]');
            parsedUrl.rootDomainName.should.eql('[1080:0:0:0:8:800:200C:417A]');
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
                'welcome',
            ];
            urls.forEach(url => UrlUtils.isUrlWithDomain(url).should.be.true());
        });
        it('should return true if input is not a URL with a domain', () => {
            const urls = [
                'http://54.77.248.115/index.html',
                '54.77.248.115:8080',
                'http://[1080:0:0:0:8:800:200C]/index.html',
                'welcome toto',
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
                'welcome',
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
            ];
            urls.forEach(url => UrlUtils.isUrl(url).should.be.false());
        });
    });
});
