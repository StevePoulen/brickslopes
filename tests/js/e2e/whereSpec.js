describe('BrickSlopes Where Page', function() {
  it('should have an where section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('whereLink')).click();

    var greeting = element(by.id('splashTextWhere'));
    expect(greeting.getText()).toContain('WHERE');
  });
});
