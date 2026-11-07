/** An outline button on the deep stage: a light hairline that brightens on hover. */
export const DEEP_OUTLINE = {
  variant: 'outline' as const,
  bg: 'transparent',
  color: 'deep.fg',
  borderColor: 'rgba(234,243,239,0.35)',
  boxShadow: 'none',
  _hover: { bg: 'rgba(234,243,239,0.06)', borderColor: 'deep.fg' },
}
