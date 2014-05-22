describe('BrickSlopes Call Us Page', function() {
  it('should have a call us section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('callUsLink')).click();

    var greeting = element(by.id('splashTextCallUs'));
    expect(greeting.getText()).toContain('CALL US');
  });
});
