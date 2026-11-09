<?php
// Publică rentski.ro din GitHub: descarcă folderul dist/ din branch-ul main și îl pune în public_html.
// Apel: https://rentski.ro/_deploy/deploy.php?key=<cheia din _deploy/.key>
// Fără cheie corectă nu face nimic. Nu atinge cgi-bin, inchirieriski, .well-known, _deploy.
// Versiunea 2 (nov 2026): doar funcții PHP, fără comenzi shell.
declare(strict_types=1);

$keyFile = __DIR__ . '/.key';
if (!is_file($keyFile)) { http_response_code(500); exit("lipsește cheia\n"); }
$key = trim((string)file_get_contents($keyFile));
if (!isset($_GET['key']) || !hash_equals($key, (string)$_GET['key'])) { http_response_code(403); exit("acces interzis\n"); }

header('Content-Type: text/plain; charset=utf-8');
set_time_limit(180);

$pub  = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
$work = dirname($pub) . '/_deploy-work';
$keep = ['cgi-bin', 'inchirieriski', '.well-known', '_deploy'];
$repoZip = 'https://codeload.github.com/edinsinaia/rentski/zip/refs/heads/main';

function fail(string $msg): void { http_response_code(500); exit("EROARE: $msg\n"); }

function rrmdir(string $dir): void {
    if (!is_dir($dir)) { if (file_exists($dir) || is_link($dir)) unlink($dir); return; }
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        $p = "$dir/$f";
        if (is_dir($p) && !is_link($p)) rrmdir($p); else unlink($p);
    }
    rmdir($dir);
}

function rcopy(string $src, string $dst): int {
    $n = 0;
    if (!is_dir($dst)) mkdir($dst, 0755, true);
    foreach (scandir($src) as $f) {
        if ($f === '.' || $f === '..') continue;
        $s = "$src/$f"; $d = "$dst/$f";
        if (is_dir($s)) { $n += rcopy($s, $d); }
        else { if (!copy($s, $d)) fail("nu pot copia $f"); $n++; }
    }
    return $n;
}

if (!class_exists('ZipArchive')) fail('extensia zip lipsește din PHP');

// 1. spațiu de lucru curat
if (is_dir($work)) rrmdir($work);
mkdir($work, 0755, true);

// 2. descarcă arhiva repo-ului
$zipPath = "$work/repo.zip";
$ch = curl_init($repoZip);
$fh = fopen($zipPath, 'wb');
curl_setopt_array($ch, [CURLOPT_FILE => $fh, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 90, CURLOPT_USERAGENT => 'rentski-deploy']);
$ok = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$cerr = curl_error($ch);
curl_close($ch); fclose($fh);
if (!$ok || $code !== 200) fail("descărcarea de pe GitHub a eșuat (HTTP $code) $cerr");

// 3. dezarhivează
$zip = new ZipArchive();
if ($zip->open($zipPath) !== true) fail('arhiva nu se poate deschide');
if (!$zip->extractTo($work)) fail('dezarhivarea a eșuat');
$zip->close();

$dist = "$work/rentski-main/dist";
if (!is_dir($dist) || !is_file("$dist/index.html")) fail('dist/ lipsește din repo sau nu are index.html');

// 4. golește public_html (păstrând folderele din $keep) și copiază dist/
foreach (scandir($pub) as $f) {
    if ($f === '.' || $f === '..' || in_array($f, $keep, true)) continue;
    rrmdir("$pub/$f");
}
$count = rcopy($dist, $pub);

// 5. curățenie
rrmdir($work);

echo "OK: rentski.ro publicat din GitHub (main) la " . date('Y-m-d H:i:s') . " ($count fișiere)\n";
