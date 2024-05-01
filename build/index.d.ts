export declare class mewcard {
  constructor(options?: {
    name?: string;
    author?: string;
    color?: string;
    theme?: "mewwme" | "mewwme1" | "themes1" | "themes2" | "themes3" | "themes4" | "themes5" | "themes6" | "themes7" | "themes8" | "themes9" | "themes10" | "themes11" | "themes12" | "themes13" | "themes14" | "themes15" | "themes16" | "themes17" | "themes18" | "themes19" | "miko" | "blank";
    brightness?: number;
    thumbnail?: string;
    requester?: string;
  });

  public setName(name: string): this;
  public setAuthor(author: string): this;
  public setColor(color: string): this;
  public setTheme(theme: string | "mewwme" | "mewwme1" | "themes1" | "themes2" | "themes3" | "themes4" | "themes5" | "themes6" | "themes7" | "themes8" | "themes9" | "themes10" | "themes11" | "themes12" | "themes13" | "themes14" | "themes15" | "themes16" | "themes17" | "themes18" | "themes19" | "miko" | "blank"): this;
  public setBrightness(brightness: number): this;
  public setThumbnail(thumbnail: string): this;
  public setRequester(requester: string): this;

  public build(): Promise<Buffer>;
}