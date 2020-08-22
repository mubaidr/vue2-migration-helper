export const vue2Imports = ['watch', 'computed']

export const vue2Hooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdated',
  'updated',
  'beforeDestroy',
  'destroyed',
]

export const vue2HooksDeprecated = ['beforeCreate', 'created']

export function toVue3HookName(name: string): string {
  return 'on' + name[0].toUpperCase() + name.substr(1)
}
