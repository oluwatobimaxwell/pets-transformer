import { defineSlotRecipe } from '@chakra-ui/react'
import { alertAnatomy, cardAnatomy, menuAnatomy, nativeSelectAnatomy, tableAnatomy, tabsAnatomy } from '@chakra-ui/react/anatomy'

/**
 * Slot recipe overrides for multi-part components. Panels are separated by a border, never by a border plus a soft shadow.
 */
export const slotRecipes = {
  card: defineSlotRecipe({
    slots: cardAnatomy.keys(),
    base: {
      root: { bg: 'bg.panel', borderRadius: 'l3', transitionProperty: 'border-color, background', transitionDuration: 'state' },
      title: { letterSpacing: '-0.01em', fontWeight: 'semibold' },
      description: { color: 'fg.muted' },
    },
    variants: {
      variant: {
        outline: { root: { borderColor: 'border' } },
      },
    },
  }),
  table: defineSlotRecipe({
    slots: tableAnatomy.keys(),
    base: {
      root: { fontVariantNumeric: 'tabular-nums' },
      columnHeader: { color: 'fg.muted', fontWeight: 'medium', bg: 'bg.subtle', textStyle: 'xs' },
      cell: { borderColor: 'border.muted', verticalAlign: 'top' },
    },
  }),
  tabs: defineSlotRecipe({
    slots: tabsAnatomy.keys(),
    base: {
      trigger: { fontWeight: 'medium', gap: '2', _selected: { color: 'fg' } },
    },
  }),
  nativeSelect: defineSlotRecipe({
    slots: nativeSelectAnatomy.keys(),
    base: { field: { borderRadius: 'control', bg: 'bg.panel' } },
  }),
  menu: defineSlotRecipe({
    slots: menuAnatomy.keys(),
    base: {
      content: { borderRadius: 'l3', borderWidth: '1px', borderColor: 'border', boxShadow: 'panel', p: '1.5' },
      item: { borderRadius: 'l2', px: '2.5', py: '2' },
    },
  }),
  alert: defineSlotRecipe({
    slots: alertAnatomy.keys(),
    base: { root: { borderRadius: 'l3', alignItems: 'flex-start' } },
  }),
}
