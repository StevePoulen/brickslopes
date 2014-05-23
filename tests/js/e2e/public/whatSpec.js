describe('BrickSlopes Who Page', function() {
  it('should have an what section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('whatLink')).click();

    var greeting = element(by.id('splashTextWhat'));
    expect(greeting.getText()).toContain('WHAT');
  });

  it('should have a sponsor section', function() {
    browser.get('http://mybrickslopes.com');

    element(by.id('whatLink')).click();

    element(by.linkText('Want to Sponsor?')).click();

    var greeting = element(by.id('splashTextCallUs'));
    expect(greeting.getText()).toContain('CALL US');
  });
});
