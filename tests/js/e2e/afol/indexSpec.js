describe('BrickSlopes Afol Page', function() {
  it('should have an afol section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.id('afolLink')).click();

    var greeting = element(by.css('.eventImageText'));
    expect(greeting.getText()).toContain('REGISTRATION');
  });
});
