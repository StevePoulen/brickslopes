describe('BrickSlopes What Page', function() {
  it('should have an what section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('whatLink')).click();

    var greeting = element(by.id('splashTextWhat'));
    expect(greeting.getText()).toContain('WHAT');
  });
});
