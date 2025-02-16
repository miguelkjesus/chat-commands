export interface Filter {
  [key: string]: FilterCriteria;
}

export class FilterCriteria<T extends string | Filter = string | Filter> {
  include: T[] = [];
  exclude: T[] = [];

  assert<Options extends FilterCriteriaAssertOptions>(options?: Options): AssertedCriteria<Options> {
    for (const value of [...this.include, ...this.exclude]) {
      if (options === "string" && typeof value === "object") {
        throw new Error("Unexpected filter.");
      } else if (options === "filter" && typeof value === "string") {
        throw new Error("Unexpected string.");
      }
    }

    return this as unknown as AssertedCriteria<Options>;
  }

  map<Include extends FilterValueMapOptions = undefined, Exclude extends FilterValueMapOptions = undefined>(
    options?: FilterCriteriaMapOptions<Include, Exclude>,
  ): {
    include: MappedFilterValue<T, Include>;
    exclude: MappedFilterValue<T, Exclude>;
  } {
    return {
      include: (options?.include === "none"
        ? undefined
        : options?.include === "single"
          ? this.include.pop()
          : this.include) as MappedFilterValue<T, Include>,
      exclude: (options?.exclude === "none"
        ? undefined
        : options?.exclude === "single"
          ? this.exclude.pop()
          : this.exclude) as MappedFilterValue<T, Exclude>,
    };
  }
}

// map criteria stuff

export type FilterValueMapOptions = "none" | "single";

export type MappedFilterValue<T extends string | Filter, Option extends FilterValueMapOptions> = "none" extends Option
  ? undefined
  : "single" extends Option
    ? T
    : Option extends undefined
      ? T[]
      : never;

export interface FilterCriteriaMapOptions<
  Include extends FilterValueMapOptions,
  Exclude extends FilterValueMapOptions,
> {
  include?: Include;
  exclude?: Exclude;
}

// assert criteria stuff

export type FilterCriteriaAssertOptions = "filter" | "string";

type AssertedCriteria<T extends FilterCriteriaAssertOptions> = "filter" extends T
  ? FilterCriteria<Filter>
  : "string" extends T
    ? FilterCriteria<string>
    : T extends undefined
      ? FilterCriteria
      : never;
