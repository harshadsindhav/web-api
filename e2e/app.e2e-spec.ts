import { SabaWebApiPage } from './app.po';

describe('saba-web-api App', () => {
  let page: SabaWebApiPage;

  beforeEach(() => {
    page = new SabaWebApiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
