type CommonParams = {
  lang: 'fr' | 'en'
}

type PageParams <T> = T extends null
  ? CommonParams
  : CommonParams & T

type SearchParams = {
  [key: string]: string | string[] | undefined
}

export type PageProps <T = null> = {
  params: PageParams<T>
  searchParams: SearchParams
}
