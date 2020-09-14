require("@babel/polyfill");

import isPalindrome from "./isPalindrome";

describe('Probar palindromos', () => {
    it('abba', () => {
        expect(isPalindrome("abba")).toEqual(true);
    });
    it('abb', () => {
        expect(isPalindrome("abb")).toEqual(false);
    });
    it('ab ba', () => {
        expect(isPalindrome("ab ba")).toEqual(true);
    });

});
