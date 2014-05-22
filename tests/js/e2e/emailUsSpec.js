describe('BrickSlopes Email Us Page', function() {
  it('should have an emal us section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('emailUsLink')).click();

    var greeting = element(by.id('splashTextEmailUs'));
    expect(greeting.getText()).toContain('EMAIL US');
  });
});
