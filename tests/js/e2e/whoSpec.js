describe('BrickSlopes Who Page', function() {
  it('should have an who section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('whoLink')).click();

    var greeting = element(by.id('splashTextWho'));
    expect(greeting.getText()).toContain('WHO');
  });
});
