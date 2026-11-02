$ErrorActionPreference = 'Stop'
$projectDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Push-Location -LiteralPath $projectDirectory
try {
  npm test
  if ($LASTEXITCODE -ne 0) { throw 'Los tests han fallado.' }
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'La compilación ha fallado.' }
  node scripts/check-deploy.mjs
  if ($LASTEXITCODE -ne 0) { throw 'La validación del despliegue ha fallado.' }
  $releaseDirectory = Join-Path $projectDirectory 'release'
  New-Item -ItemType Directory -Path $releaseDirectory -Force | Out-Null
  $archivePath = Join-Path $releaseDirectory 'js-academy-pages.zip'
  # Las entradas ZIP deben usar / incluso en Windows para los servidores web.
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  Add-Type -AssemblyName System.IO.Compression
  $distDirectory = (Resolve-Path -LiteralPath 'dist').Path
  $archiveStream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
  $archive = New-Object System.IO.Compression.ZipArchive($archiveStream, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    foreach ($file in (Get-ChildItem -LiteralPath $distDirectory -File -Recurse)) {
      $entryName = $file.FullName.Substring($distDirectory.Length + 1).Replace('\', '/')
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $entryName, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally {
    $archive.Dispose()
    $archiveStream.Dispose()
  }
  $verification = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
  try {
    $entries = @($verification.Entries | ForEach-Object { $_.FullName })
    if ($entries -notcontains 'index.html' -or $entries -notcontains '_headers') { throw 'Faltan archivos en la raíz del ZIP.' }
    if (@($entries | Where-Object { $_.Contains('\') }).Count -gt 0) { throw 'El ZIP contiene separadores incompatibles con el alojamiento web.' }
    foreach ($file in (Get-ChildItem -LiteralPath $distDirectory -File -Recurse)) {
      $expected = $file.FullName.Substring($distDirectory.Length + 1).Replace('\', '/')
      if ($entries -notcontains $expected) { throw "Falta la entrada ZIP: $expected" }
    }
  } finally { $verification.Dispose() }
  Write-Output "Paquete listo para Cloudflare Pages: $archivePath"
} finally {
  Pop-Location
}
