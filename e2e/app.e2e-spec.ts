import { DigitalPage } from './app.po';

describe('digital App', () => {
  let page: DigitalPage;

  beforeEach(() => {
    page = new DigitalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
