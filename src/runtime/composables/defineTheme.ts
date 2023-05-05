
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

type Base = {
  classes: string
  variants?: string
  props?: {
    [key: string]: Record<string, string>
  }
}

interface Theme<T extends Base> {
  base: DeepPartial<Record<T["classes"], string>>;
  defaults?: DeepPartial<Record<T["classes"], string>>;
  variants?: DeepPartial<Record<NonNullable<T["variants"]>, Record<T["classes"], string>>>;
  props: {
    [P in keyof T["props"]]: DeepPartial<Record<keyof NonNullable<T["props"][P]>, string>>
  };
}

export function defineTheme<T extends Base>(theme: Theme<T>): Theme<T> {
  return theme;
}