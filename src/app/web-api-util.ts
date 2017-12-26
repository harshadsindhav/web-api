export class WebApiUtil {

  public static readonly kHTMLFile: string = '.html';

  public static readonly kIntroductionTitle: string = 'Introduction';

  public static readonly kIntroductionFileName: string = 'restwebservicesnew-introduction-concepts';
  public static readonly kAboutThisGuideFileName: string = 'preface-integrationstudio';
  public static readonly kAuthenticationFileName: string = 'restwebservices-authentication-concepts';
  public static  readonly kSabaCopyRightFileName: string = 'saba-copyright-topic';
  public static readonly kContactSabaFileName: string = 'preface-common3-how-to-contact-saba';

  public static readonly kTitle: string = 'title';

  public static readonly kAssetRoot: string = './assets/';
  public static readonly kIndexPageName: string = 'preface-integrationstudio';

  public static readonly kApiName = 'apiName';
  public static readonly kApiFilePath = 'apiFilePath';

  public static getIndexPageURL(): string {
    return WebApiUtil.getFileURL(WebApiUtil.kIndexPageName);
  }

  public static getFileURL(filePath: string): string {
    return this.kAssetRoot + filePath + WebApiUtil.kHTMLFile;
  }
}
