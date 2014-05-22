describe('BrickSlopes homepage', function() {
  it('should have a splashTextHome section', function() {
    browser.get('http://mybrickslopes.com');

    var greeting = element(by.id('splashTextHome'));

    expect(greeting.getText()).toContain('What an event!');
  });
});
