import { repoQueryResponse } from './relay/__generated__/repoQuery.graphql'
import Configuration, {
  FileType,
  Font,
  OptionalConfigs,
  OptionalConfigsKeys,
  Pattern,
  Theme
} from './types/configType'
import QueryType from './types/queryType'

type Key = keyof typeof OptionalConfigsKeys

const DEFAULT_CONFIG: Configuration = {
  name: '',
  logo: '',
  font: Font.inter,
  theme: Theme.dark,
  pattern: Pattern.plus,
  fileType: FileType.svg
}

const getOptionalConfig = (repository: repoQueryResponse['repository']) => {
  if (repository) {
    const languages = repository.languages?.nodes || []
    const language =
      languages.length > 0 ? languages[0]?.name || 'unknown' : 'unknown'
    const newConfig: OptionalConfigs = {
      owner: { state: true, value: repository.owner.login },
      description: {
        state: false,
        editable: true,
        value: repository.description || ''
      },
      language: { state: true, value: language },
      stargazers: { state: true, value: repository.stargazerCount },
      forks: { state: false, value: repository.forkCount },
      pulls: { state: false, value: repository.pullRequests.totalCount },
      issues: { state: false, value: repository.issues.totalCount }
    }
    return newConfig
  }
  return null
}

const mergeConfig = (
  repository: repoQueryResponse['repository'],
  query: QueryType
): Configuration | null => {
  if (!repository) {
    return null
  }

  const config: Configuration = {
    name: repository.name,
    logo: query.logo || DEFAULT_CONFIG.logo,
    font: query.font || DEFAULT_CONFIG.font,
    pattern: query.pattern || DEFAULT_CONFIG.pattern,
    fileType: query.fileType || DEFAULT_CONFIG.fileType,
    theme: query.theme || DEFAULT_CONFIG.theme
  }
  const optionalConfig = getOptionalConfig(repository)

  if (optionalConfig) {
    Object.assign(config, optionalConfig)
    for (const key in query) {
      if (key in OptionalConfigsKeys) {
        Object.assign(config[key as Key], {
          state: query[key as Key] === '1'
        })
        if (config[key as Key]?.editable) {
          const editableValue = query[`${key}Editable` as keyof typeof query]
          if (editableValue) {
            Object.assign(config[key as Key], { value: editableValue })
          }
        }
      }
    }
  }

  return config
}

export { DEFAULT_CONFIG, getOptionalConfig, mergeConfig }