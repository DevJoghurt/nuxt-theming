
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]> & Partial<T[P]>
    : T[P];
};

type Base = {
  classes: string
  variants?: string
  options?: {
    [key: string]: Record<string, string>
  }
}

interface Theme<T extends Base> {
  base: DeepPartial<Record<T["classes"], string>>
  defaults?: DeepPartial<Record<T["classes"], string>>
  variants?: DeepPartial<Record<NonNullable<T["variants"]>, Record<T["classes"], string>>>
  options: {
    [P in keyof T["options"]]: DeepPartial<Record<keyof NonNullable<T["options"][P]>, string>>
  };
}

export function defineTheme<T extends Base>(theme: Theme<T>): Theme<T> {
  return theme;
}