<?php
// Publică rentski.ro din GitHub: descarcă folderul dist/ din branch-ul main și îl pune în public_html.
// Apel: https://rentski.ro/_deploy/deploy.php?key=<cheia din _deploy/.key>
// Fără cheie corectă nu face nimic. Nu atinge cgi-bin, inchirieriski, .well-known, _deploy.
declare(strict_types=1);
$keyFile = __DIR__ . '/.key';
if (!is_file($keyFile)) { http_response_code(500); exit("lipsește cheia\n"); }
$key = trim((string)file_get_contents($keyFile));
if (!isset($_GET['key']) || !hash_equals($key, (string)$_GET['key'])) { http_response_code(403); exit("acces interzis\n"); }
header('Content-Type: text/plain; charset=utf-8');
set_time_limit(120);
$pub  = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
$work = dirname($pub) . '/_deploy-work';
$log  = [];
$run = function (string $cmd) use (&$log): array {
    $out = []; $rc = 0; exec($cmd . ' 2>&1', $out, $rc);
    $log[] = "$ $cmd\n" . implode("\n", $out);
    if ($rc !== 0) { echo implode("\n\n", $log); exit("\n\nEROARE la: $cmd (cod $rc)\n"); }
    return $out;
};
$run('rm -rf ' . escapeshellarg($work) . ' && mkdir -p ' . escapeshellarg($work));
$run('curl -fsSL -o ' . escapeshellarg("$work/repo.zip") . ' https://codeload.github.com/edinsinaia/rentski/zip/refs/heads/main');
$run('cd ' . escapeshellarg($work) . ' && unzip -q repo.zip');
$dist = "$work/rentski-main/dist";
if (!is_dir($dist) || !is_file("$dist/index.html")) { echo implode("\n\n", $log); exit("\n\nEROARE: dist/ lipsește din repo sau nu are index.html\n"); }
$keep = ['cgi-bin', 'inchirieriski', '.well-known', '_deploy'];
foreach (scandir($pub) as $f) {
    if ($f === '.' || $f === '..' || in_array($f, $keep, true)) continue;
    $run('rm -rf ' . escapeshellarg("$pub/$f"));
}
$run('cp -a ' . escapeshellarg($dist) . '/. ' . escapeshellarg($pub) . '/');
$run('rm -rf ' . escapeshellarg($work));
echo 'OK: rentski.ro publicat din GitHub (main) la ' . date('Y-m-d H:i:s') . "\n";
