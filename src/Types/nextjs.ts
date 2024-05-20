import type React from 'react'

type CommonParams = {
  lang: 'fr' | 'en'
}

type Params <T> = T extends null
  ? CommonParams
  : CommonParams & T

type SearchParams = {
  [key: string]: string | string[] | undefined
}

type PageParams <T> = {
  params: Params<T>
  searchParams: SearchParams
}

export type PageProps <T = null> = Readonly<PageParams<T>>

export type LayoutProps <T = null> = PageProps<T> & React.PropsWithChildren
