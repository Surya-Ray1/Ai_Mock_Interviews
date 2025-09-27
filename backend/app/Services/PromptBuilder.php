<?php
namespace App\Services;

class PromptBuilder {
    public static function make(array $opts): string {
        $role = $opts['role'] ?? 'Software Engineer';
        $difficulty = $opts['difficulty'] ?? 'medium';
        $exp = $opts['experience_years'] ?? null;
        $stack = trim((string)($opts['tech_stack'] ?? ''));
        $company = $opts['company_type'] ?? null;
        $focus = $opts['focus_areas'] ?? [];
        $language = $opts['language'] ?? 'English';
        $focusStr = is_array($focus) ? implode(', ', $focus) : (string)$focus;

        $lines = [];
        $lines[] = "You are a professional mock interviewer for a $role.";
        $lines[] = "Conduct a real-time interview in $language.";
        $lines[] = "Use the STAR method. Ask ONE question at a time. Keep each question under 25 words.";
        $lines[] = "Adapt difficulty: $difficulty.";
        if ($exp) $lines[] = "Candidate experience: about $exp years.";
        if ($stack) $lines[] = "Primary tech stack: $stack.";
        if ($company) $lines[] = "Company type target: $company.";
        if ($focusStr) $lines[] = "Focus areas: $focusStr.";
        $lines[] = "Probe for specifics, metrics, constraints, and impact. Do NOT answer your own questions.";
        $lines[] = "Be concise and encouraging. Stop when the interviewer presses Finish.";
        return implode("\n", $lines);
    }
}