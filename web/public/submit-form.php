<?php
declare(strict_types=1);

const DESTINATION_EMAIL = 'info@eliconsults.com';
const FROM_EMAIL = 'info@eliconsults.com';
const SUCCESS_MESSAGE = 'Request submitted successfully.';
const ERROR_MESSAGE = 'Failed to submit request.';
const RATE_LIMIT_WINDOW_SECONDS = 600;
const RATE_LIMIT_MAX_REQUESTS = 6;

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond($success, $message, $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function failRequest($statusCode = 400): void
{
    respond(false, ERROR_MESSAGE, $statusCode);
}

function clientIp(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

function isRateLimited(): bool
{
    $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'eliconsults_form_rate_limit.json';
    $handle = @fopen($file, 'c+');

    if (!$handle) {
        return false;
    }

    $limited = false;

    if (@flock($handle, LOCK_EX)) {
        $now = time();
        $cutoff = $now - RATE_LIMIT_WINDOW_SECONDS;
        $contents = stream_get_contents($handle);
        $data = json_decode($contents ?: '{}', true);

        if (!is_array($data)) {
            $data = [];
        }

        foreach ($data as $key => $timestamps) {
            if (!is_array($timestamps)) {
                unset($data[$key]);
                continue;
            }

            $data[$key] = array_values(array_filter($timestamps, static function ($timestamp) use ($cutoff) {
                return is_int($timestamp) && $timestamp >= $cutoff;
            }));

            if (!$data[$key]) {
                unset($data[$key]);
            }
        }

        $rateKey = hash('sha256', clientIp());
        $requests = $data[$rateKey] ?? [];

        if (count($requests) >= RATE_LIMIT_MAX_REQUESTS) {
            $limited = true;
        } else {
            $requests[] = $now;
            $data[$rateKey] = $requests;
        }

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($data));
        fflush($handle);
        flock($handle, LOCK_UN);
    }

    fclose($handle);
    return $limited;
}

function limitLength(string $value, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function hasHeaderInjection(string $value): bool
{
    return preg_match('/(%0a|%0d|[\r\n])/i', $value) === 1;
}

function cleanText($value, int $maxLength, bool $multiline = false): string
{
    $text = trim((string) $value);
    $text = str_replace("\0", '', $text);
    $text = strip_tags($text);

    if ($multiline) {
        $text = preg_replace("/\r\n|\r/", "\n", $text);
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);
        $text = preg_replace("/[ \t]+/", ' ', $text);
        $text = preg_replace("/\n{4,}/", "\n\n\n", $text);
    } else {
        $text = preg_replace('/[\r\n\t]+/', ' ', $text);
        $text = preg_replace('/[\x00-\x1F\x7F]/', ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);
    }

    return limitLength(trim((string) $text), $maxLength);
}

function cleanEmail($value): string
{
    $email = trim((string) $value);

    if ($email === '' || hasHeaderInjection($email)) {
        return '';
    }

    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function encodedSubject(string $subject): string
{
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function tooManyLinks(array $values): bool
{
    $text = implode(' ', $values);
    preg_match_all('/https?:\/\/|www\./i', $text, $matches);
    return count($matches[0]) > 4;
}

function buildEmailBody(array $schema, array $values, string $pageUrl): string
{
    $rows = '';

    foreach ($schema['fields'] as $name => $field) {
        $value = $values[$name] !== '' ? $values[$name] : '-';
        $rows .= '<tr>'
            . '<th>' . escapeHtml($field['label']) . '</th>'
            . '<td>' . nl2br(escapeHtml($value)) . '</td>'
            . '</tr>';
    }

    $metaRows = [
        'Form' => $schema['title'],
        'Submitted At' => gmdate('Y-m-d H:i:s') . ' UTC',
        'IP Address' => clientIp(),
        'Page URL' => $pageUrl !== '' ? $pageUrl : '-',
    ];

    foreach ($metaRows as $label => $value) {
        $rows .= '<tr>'
            . '<th>' . escapeHtml($label) . '</th>'
            . '<td>' . escapeHtml($value) . '</td>'
            . '</tr>';
    }

    return '<!doctype html>'
        . '<html><head><meta charset="UTF-8">'
        . '<title>' . escapeHtml($schema['title']) . '</title>'
        . '</head>'
        . '<body style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,sans-serif;color:#0b2740;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#ffffff;border-collapse:collapse;border:1px solid #d7e2eb;">'
        . '<tr><td style="padding:24px 28px;background:#112754;color:#ffffff;">'
        . '<h1 style="margin:0;font-size:22px;line-height:1.3;">' . escapeHtml($schema['title']) . '</h1>'
        . '</td></tr>'
        . '<tr><td style="padding:24px 28px;">'
        . '<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">'
        . str_replace(
            ['<th>', '<td>'],
            [
                '<th style="width:210px;padding:12px;border-bottom:1px solid #e2ebf2;text-align:left;vertical-align:top;color:#112754;font-size:14px;">',
                '<td style="padding:12px;border-bottom:1px solid #e2ebf2;vertical-align:top;color:#334e63;font-size:14px;line-height:1.5;">',
            ],
            $rows
        )
        . '</table>'
        . '</td></tr>'
        . '</table>'
        . '</body></html>';
}

$schemas = [
    'main_contact' => [
        'title' => 'Main Contact Form',
        'subject' => 'Eliconsults - Main Contact Form',
        'fields' => [
            'fullName' => ['label' => 'Full Name', 'required' => true, 'max' => 120],
            'email' => ['label' => 'Email Address', 'required' => true, 'max' => 160, 'type' => 'email'],
            'phone' => ['label' => 'Phone Number', 'required' => false, 'max' => 40, 'type' => 'phone'],
            'subject' => ['label' => 'Subject', 'required' => false, 'max' => 150],
            'message' => ['label' => 'Message', 'required' => true, 'max' => 5000, 'multiline' => true],
        ],
    ],
    'filflex_access' => [
        'title' => 'FILFLEX Access Request Form',
        'subject' => 'Eliconsults - FILFLEX Access Request Form',
        'fields' => [
            'fullName' => ['label' => 'Full Name', 'required' => true, 'max' => 120],
            'company' => ['label' => 'Company Name', 'required' => true, 'max' => 160],
            'email' => ['label' => 'Email Address', 'required' => true, 'max' => 160, 'type' => 'email'],
            'phone' => ['label' => 'Phone Number', 'required' => true, 'max' => 40, 'type' => 'phone'],
            'business' => ['label' => 'Nature of Business', 'required' => false, 'max' => 180],
            'location' => ['label' => 'Location', 'required' => false, 'max' => 180],
        ],
    ],
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    failRequest(405);
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(true, SUCCESS_MESSAGE);
}

if (isRateLimited()) {
    failRequest(429);
}

$formType = cleanText($_POST['form_type'] ?? '', 40);

if (!isset($schemas[$formType])) {
    failRequest(400);
}

$schema = $schemas[$formType];
$values = [];
$errors = [];

foreach ($schema['fields'] as $name => $field) {
    $isEmail = ($field['type'] ?? '') === 'email';
    $isPhone = ($field['type'] ?? '') === 'phone';
    $value = $isEmail
        ? cleanEmail($_POST[$name] ?? '')
        : cleanText($_POST[$name] ?? '', $field['max'], (bool) ($field['multiline'] ?? false));

    if (($field['required'] ?? false) && $value === '') {
        $errors[] = $name;
    }

    if ($isPhone && $value !== '' && preg_match('/^[0-9+().\-\s]{7,40}$/', $value) !== 1) {
        $errors[] = $name;
    }

    if (!$isEmail && hasHeaderInjection($value)) {
        $errors[] = $name;
    }

    $values[$name] = $value;
}

if ($errors || tooManyLinks($values)) {
    failRequest(422);
}

$pageUrl = cleanText($_POST['page_url'] ?? '', 500);

if ($pageUrl !== '' && filter_var($pageUrl, FILTER_VALIDATE_URL) === false) {
    $pageUrl = '';
}

$emailSubject = $schema['subject'];

if ($formType === 'main_contact' && ($values['subject'] ?? '') !== '') {
    $emailSubject .= ' - ' . $values['subject'];
}

$emailSubject = cleanText($emailSubject, 180);
$body = buildEmailBody($schema, $values, $pageUrl);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Eliconsults Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $values['email'],
];

$sent = @mail(
    DESTINATION_EMAIL,
    encodedSubject($emailSubject),
    $body,
    implode("\r\n", $headers),
    '-f ' . FROM_EMAIL
);

if (!$sent) {
    $sent = @mail(
        DESTINATION_EMAIL,
        encodedSubject($emailSubject),
        $body,
        implode("\r\n", $headers)
    );
}

if (!$sent) {
    failRequest(500);
}

respond(true, SUCCESS_MESSAGE);
