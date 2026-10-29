# Chay TASK_05A -> 05B -> 05C bang Claude Code, khong can bam cho phep.
# Chay o goc repo:  powershell -ExecutionPolicy Bypass -File .ai\chay_dem.ps1
# Task nao da co file DONE thi bo qua (chay lai script la lam tiep phan con thieu).

$tools = @(
  "Read", "Edit", "Write", "Glob", "Grep",
  "Bash(node:*)", "Bash(tr:*)", "Bash(wc:*)", "Bash(grep:*)", "Bash(touch:*)",
  "Bash(git status:*)", "Bash(git diff:*)", "Bash(git show:*)", "Bash(git log:*)",
  "Bash(git add:*)", "Bash(git commit:*)"
)

foreach ($t in @("05A", "05B", "05C")) {
  if (Test-Path ".ai/tasks/DONE_$t") { Write-Host "Bo qua TASK_$t (da co DONE)"; continue }
  Write-Host "=== Bat dau TASK_$t luc $(Get-Date -Format HH:mm)"
  claude -p "Doc AGENTS.md. Ban dong vai THO (nguoi lam theo task), khong phai nguoi lap ke hoach. CHI lam file .ai/tasks/TASK_$t.md tu dau den het, ke ca phan 'Ket thuc': tao file DONE va chay dung lenh git add / git commit ghi trong task. Khong sang task khac, khong push. Neu khong lam duoc thi van ghi bao cao, tao file DONE roi dung." --permission-mode acceptEdits --allowedTools $tools
  Write-Host "=== Ket thuc TASK_$t luc $(Get-Date -Format HH:mm)"
}
Write-Host "XONG. Sang mai chay: git push"
