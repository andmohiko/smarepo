import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

import { HapticTab } from '~/components/haptic-tab'
import { IconSymbol } from '~/components/ui/icon-symbol'
import { Colors } from '~/constants/theme'
import { useColorScheme } from '~/hooks/use-color-scheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 0,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          height: Platform.OS === 'ios' ? 88 : 84,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'オンライン戦績',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'fight.fill' : 'fight'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: '分析',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'timeline.fill' : 'timeline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'マイページ',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'person.fill' : 'person'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
