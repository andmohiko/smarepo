import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight,
} from 'expo-symbols'
import type { StyleProp, ViewStyle } from 'react-native'

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'] | string
  size?: number
  color: string
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name as SymbolViewProps['name']}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  )
}
