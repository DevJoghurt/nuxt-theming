export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object
      ? DeepPartial<T[P]> & Partial<T[P]>
      : T[P];
};
  
export type ThemeSchema = {
    keys: string
    variants?: string
    options?: {
      [key: string]: Record<string, string>
    }
    presets?: string
}
  
export interface Theme<T extends ThemeSchema> {
    base: DeepPartial<Record<T["keys"], string>>
    defaults?: DeepPartial<Record<T["keys"], string>>
    variants?: DeepPartial<Record<NonNullable<T["variants"]>, Record<T["keys"], string>>>
    options?: {
        [P in keyof T["options"]]: DeepPartial<Record<keyof NonNullable<T["options"][P]>, string>>
    }
    presets?: DeepPartial<Record<NonNullable<T["presets"]>, string | Record<string, string>>>
}