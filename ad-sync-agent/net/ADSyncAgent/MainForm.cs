using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace ADSyncAgent
{
    public partial class MainForm : Form
    {
        private Process agentProcess;
        private Thread logThread;
        private bool isRunning = false;

        public MainForm()
        {
            InitializeComponent();
            LoadSettings();
        }

        private void LoadSettings()
        {
            // Load from .env file if exists
            string envPath = Path.Combine(Application.StartupPath, ".env");
            if (File.Exists(envPath))
            {
                LoadFromEnvFile(envPath);
            }
        }

        private void LoadFromEnvFile(string filePath)
        {
            try
            {
                var lines = File.ReadAllLines(filePath);
                foreach (var line in lines)
                {
                    if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#"))
                        continue;

                    var parts = line.Split(new[] { '=' }, 2);
                    if (parts.Length == 2)
                    {
                        string key = parts[0].Trim();
                        string value = parts[1].Trim();

                        switch (key.ToUpper())
                        {
                            case "AD_HOST":
                                txtAdServer.Text = value;
                                break;
                            case "AD_USERNAME":
                                txtAdUsername.Text = value;
                                break;
                            case "AD_PASSWORD":
                                txtAdPassword.Text = value;
                                break;
                            case "AD_BASE_DN":
                                txtAdBaseDn.Text = value;
                                break;
                            case "PLATFORM_URL":
                                txtPlatformUrl.Text = value;
                                break;
                            case "TENANT_ID":
                                txtTenantId.Text = value;
                                break;
                            case "API_KEY":
                                txtApiKey.Text = value;
                                break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                AppendLog($"Ошибка загрузки .env файла: {ex.Message}");
            }
        }

        private void SaveSettings()
        {
            try
            {
                string envPath = Path.Combine(Application.StartupPath, ".env");
                
                var lines = new List<string>
                {
                    "# Active Directory Configuration",
                    $"AD_HOST={txtAdServer.Text}",
                    $"AD_USERNAME={txtAdUsername.Text}",
                    $"AD_PASSWORD={txtAdPassword.Text}",
                    $"AD_BASE_DN={txtAdBaseDn.Text}",
                    "",
                    "# Platform Configuration",
                    $"PLATFORM_URL={txtPlatformUrl.Text}",
                    $"TENANT_ID={txtTenantId.Text}",
                    $"API_KEY={txtApiKey.Text}",
                    "",
                    "# Sync Settings",
                    "SYNC_INTERVAL=3600"
                };

                File.WriteAllLines(envPath, lines);
                AppendLog("Настройки сохранены в .env файл");
                MessageBox.Show("Настройки успешно сохранены!", "Успех", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                AppendLog($"Ошибка при сохранении: {ex.Message}");
                MessageBox.Show($"Ошибка при сохранении настроек:\n{ex.Message}", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void StartAgent()
        {
            if (isRunning)
            {
                MessageBox.Show("Агент уже запущен!", "Внимание", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Check if .env file exists
            string envPath = Path.Combine(Application.StartupPath, ".env");
            if (!File.Exists(envPath))
            {
                MessageBox.Show("Сначала сохраните настройки!", "Внимание", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Check if Python script exists
            string scriptPath = Path.Combine(Application.StartupPath, "ad_sync_agent.py");
            if (!File.Exists(scriptPath))
            {
                MessageBox.Show(
                    $"Файл ad_sync_agent.py не найден!\n\nПоместите файл ad_sync_agent.py в папку:\n{Application.StartupPath}",
                    "Ошибка",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
                return;
            }

            try
            {
                AppendLog("Запуск агента...");
                lblStatus.Text = "Агент запущен...";
                lblStatus.ForeColor = System.Drawing.Color.Orange;

                // Start Python process
                var startInfo = new ProcessStartInfo
                {
                    FileName = "python",
                    Arguments = $"\"{scriptPath}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = Application.StartupPath
                };

                agentProcess = new Process { StartInfo = startInfo };
                agentProcess.OutputDataReceived += (sender, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                    {
                        this.Invoke(new Action(() => AppendLog(e.Data)));
                    }
                };
                agentProcess.ErrorDataReceived += (sender, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                    {
                        this.Invoke(new Action(() => AppendLog($"ERROR: {e.Data}")));
                    }
                };

                agentProcess.Start();
                agentProcess.BeginOutputReadLine();
                agentProcess.BeginErrorReadLine();

                isRunning = true;
                btnStart.Enabled = false;
                btnStop.Enabled = true;
                lblStatus.Text = "Агент работает...";
                lblStatus.ForeColor = System.Drawing.Color.Green;

                AppendLog("Агент успешно запущен!");
            }
            catch (Exception ex)
            {
                AppendLog($"Ошибка при запуске: {ex.Message}");
                MessageBox.Show($"Не удалось запустить агента:\n{ex.Message}", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
                isRunning = false;
                btnStart.Enabled = true;
                btnStop.Enabled = false;
                lblStatus.Text = "Ошибка запуска";
                lblStatus.ForeColor = System.Drawing.Color.Red;
            }
        }

        private void StopAgent()
        {
            if (!isRunning || agentProcess == null)
                return;

            try
            {
                AppendLog("Остановка агента...");
                
                if (!agentProcess.HasExited)
                {
                    agentProcess.Kill();
                    agentProcess.WaitForExit(5000);
                }

                agentProcess.Dispose();
                agentProcess = null;
                isRunning = false;
                btnStart.Enabled = true;
                btnStop.Enabled = false;
                lblStatus.Text = "Агент остановлен";
                lblStatus.ForeColor = System.Drawing.Color.Red;

                AppendLog("Агент остановлен");
            }
            catch (Exception ex)
            {
                AppendLog($"Ошибка при остановке: {ex.Message}");
            }
        }

        private void AppendLog(string message)
        {
            if (txtLog.InvokeRequired)
            {
                txtLog.Invoke(new Action<string>(AppendLog), message);
                return;
            }

            txtLog.AppendText($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}\r\n");
            txtLog.SelectionStart = txtLog.Text.Length;
            txtLog.ScrollToCaret();
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            SaveSettings();
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            StartAgent();
        }

        private void btnStop_Click(object sender, EventArgs e)
        {
            StopAgent();
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (isRunning)
            {
                StopAgent();
            }
            base.OnFormClosing(e);
        }
    }
}

