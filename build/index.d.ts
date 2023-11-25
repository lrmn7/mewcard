export declare class mewcard {
  constructor(options?: {
    name?: string;
    author?: string;
    color?: string;
    theme?: "classic";
    brightness?: number;
    thumbnail?: string;
  });

  public setName(name: string): this;
  public setAuthor(author: string): this;
  public setColor(color: string): this;
  public setTheme(theme: "classic"): this;
  public setBrightness(brightness: number): this;
  public setThumbnail(thumbnail: string): this;
  public setRequester(requester: string): this;

  public build(): Promise<Buffer>;
}