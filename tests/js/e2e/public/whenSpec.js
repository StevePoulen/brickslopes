describe('BrickSlopes When Page', function() {
  it('should have an when section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('whenLink')).click();

    var greeting = element(by.id('splashTextWhen'));
    expect(greeting.getText()).toContain('Ticket');
  });
});
