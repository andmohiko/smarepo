import { FlexBox } from '~/components/Base/FlexBox'
import { SwitchInput } from '~/components/Inputs/SwitchInput'
import { HalfBottomSheet } from '~/components/Modals/HalfBottomSheet'
import { LabelText } from '~/components/Typography/LabelText'
import { useAnalyticsSettingsContext } from '~/providers/AnalyticsSettingsProvider'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const AnalyticsSettingsModal = ({ isOpen, onClose }: Props) => {
  const { analyticsSettings, setAnalyticsSettings } =
    useAnalyticsSettingsContext()

  return (
    <HalfBottomSheet
      title="マッチアップ分析設定"
      isOpen={isOpen}
      onClose={onClose}
    >
      <FlexBox direction="row" justify="space-between">
        <LabelText weight="bold">
          ダッシュファイターをまとめて表示する
        </LabelText>
        <SwitchInput
          value={analyticsSettings.isGroupDashFighters}
          onChange={(value) => {
            setAnalyticsSettings({
              isGroupDashFighters: value,
            })
          }}
        />
      </FlexBox>
    </HalfBottomSheet>
  )
}
