import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/useGameStore'
import {
  getSpecialtyName,
  getTaskName,
  getTaskEmoji,
  getExpPerLevel,
  type ApprenticeTaskType,
  type ApprenticeAccidentType,
} from '@/data/gameData'
import {
  ArrowLeft,
  Brain,
  UtensilsCrossed,
  Wrench,
  Activity,
  Target,
  Star,
  Coffee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Coins,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Apprentice() {
  const apprentices = useGameStore(s => s.apprentices)
  const assignApprenticeTask = useGameStore(s => s.assignApprenticeTask)
  const restApprentice = useGameStore(s => s.restApprentice)
  const tickApprentices = useGameStore(s => s.tickApprentices)
  const apprenticeTaskResult = useGameStore(s => s.apprenticeTaskResult)
  const showApprenticeResult = useGameStore(s => s.showApprenticeResult)
  const dismissApprenticeResult = useGameStore(s => s.dismissApprenticeResult)
  const player = useGameStore(s => s.player)

  const [selectedApprentice, setSelectedApprentice] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
      tickApprentices()
    }, 200)
    return () => clearInterval(interval)
  }, [tickApprentices])

  const expPerLevel = getExpPerLevel()

  const taskOptions: ApprenticeTaskType[] = ['examine', 'feed', 'repair']

  return (
    <div className="h-screen w-screen bg-deep-space text-gray-100 overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-cyan-900/30 bg-gray-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h1 className="font-display text-lg tracking-widest text-purple-300">
              学徒培养中心
            </h1>
          </div>
          <span className="text-[10px] text-gray-600 hidden sm:inline">
            APPRENTICE TRAINING v1.0
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-cyan-400" />
            <span className="font-display text-lg text-cyan-300">{player.coins}</span>
            <span className="text-xs text-gray-500">⬡</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>运营中</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-gray-900/40 rounded-xl p-4 border border-purple-900/30">
            <h2 className="font-display text-sm tracking-wider text-purple-300 mb-1">培养指南</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              派遣学徒执行任务积累经验与熟练度，专精任务获得额外加成。注意管理压力值，过高会增加出错率！
              成功可获得星币奖励，失败将扣除星币并可能引发小事故。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apprentices.map(apprentice => {
              const isSelected = selectedApprentice === apprentice.id
              const isWorking = apprentice.status === 'working'
              const taskProgress = isWorking && apprentice.taskStartTime
                ? Math.min(100, ((Date.now() - apprentice.taskStartTime) / apprentice.taskDuration) * 100)
                : 0
              const expPercent = (apprentice.exp / expPerLevel) * 100
              const isStressed = apprentice.stress >= 70
              const canWork = !isWorking && apprentice.stress < 90

              return (
                <div
                  key={apprentice.id}
                  className={`
                    rounded-xl border transition-all duration-300 overflow-hidden
                    ${isSelected
                      ? 'bg-purple-900/20 border-purple-500/50 ring-1 ring-purple-500/30'
                      : 'bg-gray-900/40 border-gray-700/30 hover:border-purple-800/40'
                    }
                    ${isWorking ? 'opacity-90' : ''}
                  `}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => canWork && setSelectedApprentice(isSelected ? null : apprentice.id)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-900/60 to-gray-800 flex items-center justify-center text-3xl border border-purple-700/30">
                          {apprentice.avatar}
                        </div>
                        {isWorking && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
                            <span className="text-[8px]">⚡</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base text-gray-100 tracking-wide">
                            {apprentice.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                            Lv.{apprentice.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-400 mt-0.5">
                          {getSpecialtyName(apprentice.specialty)}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: `${expPercent}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-500">{apprentice.exp}/{expPerLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <ProficiencyBar
                        label="检查"
                        value={apprentice.proficiency.examine}
                        icon={<Brain className="w-2.5 h-2.5" />}
                        highlight={apprentice.specialty === 'examine'}
                      />
                      <ProficiencyBar
                        label="喂食"
                        value={apprentice.proficiency.feed}
                        icon={<UtensilsCrossed className="w-2.5 h-2.5" />}
                        highlight={apprentice.specialty === 'feed'}
                      />
                      <ProficiencyBar
                        label="维修"
                        value={apprentice.proficiency.repair}
                        icon={<Wrench className="w-2.5 h-2.5" />}
                        highlight={apprentice.specialty === 'repair'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/40 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className={`w-3 h-3 ${isStressed ? 'text-red-400' : 'text-orange-400'}`} />
                          <span className="text-[10px] text-gray-400">压力</span>
                          <span className={`ml-auto text-[10px] ${isStressed ? 'text-red-400' : 'text-gray-300'}`}>
                            {apprentice.stress}%
                          </span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isStressed
                                ? 'bg-gradient-to-r from-red-600 to-red-400'
                                : 'bg-gradient-to-r from-orange-600 to-orange-400'
                            }`}
                            style={{ width: `${apprentice.stress}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-800/40 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Target className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] text-gray-400">出错率</span>
                          <span className="ml-auto text-[10px] text-gray-300">
                            {apprentice.errorRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, apprentice.errorRate * 3)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {isWorking && (
                      <div className="mt-3 bg-cyan-900/20 rounded-lg p-2 border border-cyan-800/30">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{getTaskEmoji(apprentice.assignedTask!)}</span>
                            <span className="text-[11px] text-cyan-300">
                              正在{getTaskName(apprentice.assignedTask!)}
                            </span>
                          </div>
                          <span className="text-[10px] text-cyan-400">
                            {taskProgress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-200"
                            style={{ width: `${taskProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!isWorking && (
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-green-400">{apprentice.successes}</span>
                          <span>成功</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">{apprentice.failures}</span>
                          <span>失败</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isSelected && canWork && (
                    <div className="border-t border-purple-800/30 bg-purple-950/20 p-3 space-y-2">
                      <p className="text-[11px] text-gray-400">选择任务派遣：</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {taskOptions.map(task => {
                          const isSpecialty = apprentice.specialty === task
                          return (
                            <button
                              key={task}
                              onClick={() => {
                                assignApprenticeTask(apprentice.id, task)
                                setSelectedApprentice(null)
                              }}
                              className={`
                                flex flex-col items-center gap-0.5 p-2 rounded-lg border transition-all
                                ${isSpecialty
                                  ? 'bg-purple-900/40 border-purple-600/40 hover:bg-purple-900/60 text-purple-200'
                                  : 'bg-gray-800/40 border-gray-700/40 hover:bg-gray-800/70 text-gray-300'
                                }
                              `}
                            >
                              <span className="text-lg">{getTaskEmoji(task)}</span>
                              <span className="text-[10px]">{getTaskName(task)}</span>
                              {isSpecialty && (
                                <span className="text-[8px] text-yellow-400 flex items-center gap-0.5">
                                  <Star className="w-2 h-2" />专精
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                      {apprentice.stress > 40 && (
                        <button
                          onClick={() => {
                            restApprentice(apprentice.id)
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-orange-900/30 border border-orange-700/30 text-orange-300 text-[11px] hover:bg-orange-900/50 transition-colors"
                        >
                          <Coffee className="w-3 h-3" />
                          休息减压 (-30% 压力)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showApprenticeResult && apprenticeTaskResult && (
        <ApprenticeResultOverlay
          result={apprenticeTaskResult}
          onClose={dismissApprenticeResult}
        />
      )}
    </div>
  )
}

function ProficiencyBar({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: number
  icon: React.ReactNode
  highlight: boolean
}) {
  return (
    <div className={`bg-gray-800/40 rounded-lg p-1.5 ${highlight ? 'ring-1 ring-yellow-500/30 bg-yellow-900/10' : ''}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className={highlight ? 'text-yellow-400' : 'text-gray-500'}>{icon}</span>
        <span className="text-[9px] text-gray-400">{label}</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            highlight
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
              : 'bg-gradient-to-r from-purple-700 to-purple-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[9px] text-gray-500 mt-0.5 text-center">{value}</p>
    </div>
  )
}

function ApprenticeResultOverlay({
  result,
  onClose,
}: {
  result: ReturnType<typeof useGameStore.getState>['apprenticeTaskResult']
  onClose: () => void
}) {
  if (!result) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`
          relative z-10 flex flex-col items-center max-w-sm w-full mx-4 p-6 rounded-2xl border
          ${result.success
            ? 'bg-gradient-to-b from-green-950/90 to-gray-950/90 border-green-700/50'
            : 'bg-gradient-to-b from-red-950/90 to-gray-950/90 border-red-700/50'
          }
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4">
          <ResultAnimation type={result.accidentType} success={result.success} />
        </div>

        <h2 className={`font-display text-2xl tracking-wider mb-1 ${
          result.success ? 'text-green-400' : 'text-red-400'
        }`}>
          {result.success ? '✨ 任务完成 ✨' : '⚠ 发生事故 ⚠'}
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{getTaskEmoji(result.taskType)}</span>
          <span className="text-sm text-gray-300">{result.apprenticeName} · {getTaskName(result.taskType)}</span>
        </div>

        <p className="text-sm text-gray-300 text-center mb-4 leading-relaxed">
          {result.message}
        </p>

        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] text-gray-400">经验</span>
            <span className="ml-auto text-xs text-yellow-300">+{result.expGained}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
            <Star className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] text-gray-400">熟练度</span>
            <span className="ml-auto text-xs text-purple-300">+{result.proficiencyGain}</span>
          </div>
          <div className={`flex items-center gap-2 bg-gray-900/50 rounded-lg p-2`}>
            {result.stressChange > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-green-400" />
            )}
            <span className="text-[11px] text-gray-400">压力</span>
            <span className={`ml-auto text-xs ${result.stressChange > 0 ? 'text-orange-300' : 'text-green-300'}`}>
              +{result.stressChange}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-gray-400">星币</span>
            <span className={`ml-auto text-xs ${result.success ? 'text-green-300' : 'text-red-300'}`}>
              {result.success ? `+${result.coinsReward}` : `-${result.coinsPenalty}`} ⬡
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`
            w-full py-2.5 rounded-lg font-display text-sm tracking-wide transition-colors
            ${result.success
              ? 'bg-green-800/50 border border-green-600/40 text-green-200 hover:bg-green-800/70'
              : 'bg-red-800/50 border border-red-600/40 text-red-200 hover:bg-red-800/70'
            }
          `}
        >
          继续
        </button>

        <p className="text-[10px] text-gray-600 mt-3 animate-pulse">点击任意处继续</p>
      </div>
    </div>
  )
}

function ResultAnimation({
  type,
  success,
}: {
  type: ApprenticeAccidentType | null
  success: boolean
}) {
  if (success) {
    return (
      <div className="relative w-28 h-28 flex items-center justify-center">
        <span className="text-6xl block animate-bounce">🎉</span>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute text-2xl apprentice-success-spark"
            style={{
              top: `${20 + Math.sin(i) * 30}%`,
              left: `${20 + Math.cos(i) * 30}%`,
              animationDelay: `${i * 150}ms`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    )
  }

  switch (type) {
    case 'overfeed':
      return (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <span className="text-6xl block apprentice-accident-shake">🫃</span>
          <div className="absolute -bottom-1 right-0 text-2xl">💨</div>
          <div className="absolute top-1 left-0 text-xl animate-pulse">😵</div>
        </div>
      )
    case 'misdiagnosis':
      return (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <span className="text-6xl block apprentice-accident-shake">📝</span>
          <div className="absolute top-2 right-2 text-2xl animate-pulse">❌</div>
          <AlertTriangle className="absolute bottom-0 left-0 w-6 h-6 text-yellow-400" />
        </div>
      )
    case 'equipment_break':
      return (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <span className="text-6xl block apprentice-accident-shake">🔧</span>
          <div className="absolute top-0 right-2 text-2xl apprentice-success-spark">💥</div>
          <div className="absolute bottom-1 left-1 text-xl">⚙️</div>
        </div>
      )
    case 'stress_out':
      return (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <span className="text-6xl block">😮‍💨</span>
          <div className="absolute top-0 right-1 text-2xl animate-pulse">💤</div>
          <div className="absolute bottom-1 left-1 text-xl">☕</div>
        </div>
      )
    default:
      return (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <span className="text-6xl block apprentice-accident-shake">⚠️</span>
        </div>
      )
  }
}
