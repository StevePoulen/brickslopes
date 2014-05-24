describe('BrickSlopes Afol Page', function() {
  it('should have an afol section', function() {
    browser.get('http://mybrickslopes.com');

    var link = element(by.css('#afolContainer')).click();

    var greeting = element(by.css('#login'));
    expect(greeting.getText()).toContain('Login to BRICKSLOPES');
  });
});
