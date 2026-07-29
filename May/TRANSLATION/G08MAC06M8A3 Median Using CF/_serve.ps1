param([int]$Port = 8124)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mime = @{
  ".html"="text/html"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg";
  ".jpeg"="image/jpeg"; ".gif"="image/gif"; ".svg"="image/svg+xml";
  ".mp3"="audio/mpeg"; ".wav"="audio/wav"; ".woff"="font/woff"; ".woff2"="font/woff2"; ".ico"="image/x-icon"
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$Port/"
while ($true) {
  try {
    if (-not $listener.IsListening) { $listener.Start() }
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    $res.KeepAlive = $false
    $res.Headers.Add("Connection", "close")
    $res.Headers.Add("Cache-Control", "no-store")
    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    $path = Join-Path $root $rel
    if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentType = $ct; $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
  } catch { try { $res.StatusCode = 500; $res.OutputStream.Close() } catch {} }
}
