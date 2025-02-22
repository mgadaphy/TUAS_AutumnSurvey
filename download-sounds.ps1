# Create directories if they don't exist
$directories = @(
    "audio/emotional",
    "audio/navigation",
    "audio/achievements",
    "audio/blueberries"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Download sound files
$sounds = @{
    "audio/emotional/very-satisfied.mp3" = "https://assets.mixkit.co/active_storage/sfx/2017/winning-chimes-notification.wav"
    "audio/emotional/satisfied.mp3" = "https://assets.mixkit.co/active_storage/sfx/2018/positive-notification.wav"
    "audio/emotional/neutral.mp3" = "https://assets.mixkit.co/active_storage/sfx/2019/quick-neutral-notification.wav"
    "audio/emotional/dissatisfied.mp3" = "https://assets.mixkit.co/active_storage/sfx/2020/game-notification-alert.wav"
    "audio/emotional/very-dissatisfied.mp3" = "https://assets.mixkit.co/active_storage/sfx/2021/retro-negative-notification.wav"
    "audio/navigation/next.mp3" = "https://assets.mixkit.co/active_storage/sfx/2022/ui-confirmation.wav"
    "audio/navigation/back.mp3" = "https://assets.mixkit.co/active_storage/sfx/2023/ui-cancel.wav"
    "audio/achievements/section-complete.mp3" = "https://assets.mixkit.co/active_storage/sfx/2024/fantasy-success.wav"
    "audio/achievements/survey-complete.mp3" = "https://assets.mixkit.co/active_storage/sfx/2025/achievement-unlocked.wav"
    "audio/blueberries/collect.mp3" = "https://assets.mixkit.co/active_storage/sfx/2026/soft-pop.wav"
    "audio/blueberries/basket.mp3" = "https://assets.mixkit.co/active_storage/sfx/2027/item-pickup.wav"
}

foreach ($sound in $sounds.GetEnumerator()) {
    $outputFile = $sound.Key
    $url = $sound.Value
    
    Write-Host "Downloading $($sound.Key)..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputFile
    }
    catch {
        Write-Host "Failed to download $($sound.Key): $_"
    }
}
