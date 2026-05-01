$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:4173/")
$listener.Start()
Write-Host "Tech Atelier demo: http://localhost:4173/demo.html"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.AbsolutePath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($path)) {
      $path = "demo.html"
    }

    $filePath = Join-Path $root $path
    if ((Test-Path $filePath) -and ((Get-Item $filePath).FullName.StartsWith($root))) {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $context.Response.ContentType = if ($filePath.EndsWith(".html")) { "text/html; charset=utf-8" } else { "text/plain; charset=utf-8" }
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $context.Response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $context.Response.Close()
  }
}
finally {
  $listener.Stop()
}
