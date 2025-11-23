namespace ADSyncAgent
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.GroupBox gbAdSettings;
        private System.Windows.Forms.Label lblAdServer;
        private System.Windows.Forms.TextBox txtAdServer;
        private System.Windows.Forms.Label lblAdUsername;
        private System.Windows.Forms.TextBox txtAdUsername;
        private System.Windows.Forms.Label lblAdPassword;
        private System.Windows.Forms.TextBox txtAdPassword;
        private System.Windows.Forms.Label lblAdBaseDn;
        private System.Windows.Forms.TextBox txtAdBaseDn;
        private System.Windows.Forms.GroupBox gbPlatformSettings;
        private System.Windows.Forms.Label lblPlatformUrl;
        private System.Windows.Forms.TextBox txtPlatformUrl;
        private System.Windows.Forms.Label lblTenantId;
        private System.Windows.Forms.TextBox txtTenantId;
        private System.Windows.Forms.Label lblApiKey;
        private System.Windows.Forms.TextBox txtApiKey;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.Button btnStart;
        private System.Windows.Forms.Button btnStop;
        private System.Windows.Forms.GroupBox gbLogs;
        private System.Windows.Forms.TextBox txtLog;
        private System.Windows.Forms.Label lblStatus;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lblTitle = new System.Windows.Forms.Label();
            this.gbAdSettings = new System.Windows.Forms.GroupBox();
            this.lblAdServer = new System.Windows.Forms.Label();
            this.txtAdServer = new System.Windows.Forms.TextBox();
            this.lblAdUsername = new System.Windows.Forms.Label();
            this.txtAdUsername = new System.Windows.Forms.TextBox();
            this.lblAdPassword = new System.Windows.Forms.Label();
            this.txtAdPassword = new System.Windows.Forms.TextBox();
            this.lblAdBaseDn = new System.Windows.Forms.Label();
            this.txtAdBaseDn = new System.Windows.Forms.TextBox();
            this.gbPlatformSettings = new System.Windows.Forms.GroupBox();
            this.lblPlatformUrl = new System.Windows.Forms.Label();
            this.txtPlatformUrl = new System.Windows.Forms.TextBox();
            this.lblTenantId = new System.Windows.Forms.Label();
            this.txtTenantId = new System.Windows.Forms.TextBox();
            this.lblApiKey = new System.Windows.Forms.Label();
            this.txtApiKey = new System.Windows.Forms.TextBox();
            this.btnSave = new System.Windows.Forms.Button();
            this.btnStart = new System.Windows.Forms.Button();
            this.btnStop = new System.Windows.Forms.Button();
            this.gbLogs = new System.Windows.Forms.GroupBox();
            this.txtLog = new System.Windows.Forms.TextBox();
            this.lblStatus = new System.Windows.Forms.Label();
            this.gbAdSettings.SuspendLayout();
            this.gbPlatformSettings.SuspendLayout();
            this.gbLogs.SuspendLayout();
            this.SuspendLayout();
            // 
            // lblTitle
            // 
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.lblTitle.Location = new System.Drawing.Point(12, 9);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(168, 26);
            this.lblTitle.TabIndex = 0;
            this.lblTitle.Text = "AD Sync Agent";
            // 
            // gbAdSettings
            // 
            this.gbAdSettings.Controls.Add(this.lblAdBaseDn);
            this.gbAdSettings.Controls.Add(this.txtAdBaseDn);
            this.gbAdSettings.Controls.Add(this.lblAdPassword);
            this.gbAdSettings.Controls.Add(this.txtAdPassword);
            this.gbAdSettings.Controls.Add(this.lblAdUsername);
            this.gbAdSettings.Controls.Add(this.txtAdUsername);
            this.gbAdSettings.Controls.Add(this.lblAdServer);
            this.gbAdSettings.Controls.Add(this.txtAdServer);
            this.gbAdSettings.Location = new System.Drawing.Point(12, 48);
            this.gbAdSettings.Name = "gbAdSettings";
            this.gbAdSettings.Size = new System.Drawing.Size(660, 140);
            this.gbAdSettings.TabIndex = 1;
            this.gbAdSettings.TabStop = false;
            this.gbAdSettings.Text = "Настройки Active Directory";
            // 
            // lblAdServer
            // 
            this.lblAdServer.AutoSize = true;
            this.lblAdServer.Location = new System.Drawing.Point(6, 25);
            this.lblAdServer.Name = "lblAdServer";
            this.lblAdServer.Size = new System.Drawing.Size(68, 13);
            this.lblAdServer.TabIndex = 0;
            this.lblAdServer.Text = "AD Сервер:";
            // 
            // txtAdServer
            // 
            this.txtAdServer.Location = new System.Drawing.Point(120, 22);
            this.txtAdServer.Name = "txtAdServer";
            this.txtAdServer.Size = new System.Drawing.Size(530, 20);
            this.txtAdServer.TabIndex = 1;
            // 
            // lblAdUsername
            // 
            this.lblAdUsername.AutoSize = true;
            this.lblAdUsername.Location = new System.Drawing.Point(6, 51);
            this.lblAdUsername.Name = "lblAdUsername";
            this.lblAdUsername.Size = new System.Drawing.Size(80, 13);
            this.lblAdUsername.TabIndex = 2;
            this.lblAdUsername.Text = "Пользователь:";
            // 
            // txtAdUsername
            // 
            this.txtAdUsername.Location = new System.Drawing.Point(120, 48);
            this.txtAdUsername.Name = "txtAdUsername";
            this.txtAdUsername.Size = new System.Drawing.Size(530, 20);
            this.txtAdUsername.TabIndex = 3;
            // 
            // lblAdPassword
            // 
            this.lblAdPassword.AutoSize = true;
            this.lblAdPassword.Location = new System.Drawing.Point(6, 77);
            this.lblAdPassword.Name = "lblAdPassword";
            this.lblAdPassword.Size = new System.Drawing.Size(48, 13);
            this.lblAdPassword.TabIndex = 4;
            this.lblAdPassword.Text = "Пароль:";
            // 
            // txtAdPassword
            // 
            this.txtAdPassword.Location = new System.Drawing.Point(120, 74);
            this.txtAdPassword.Name = "txtAdPassword";
            this.txtAdPassword.PasswordChar = '*';
            this.txtAdPassword.Size = new System.Drawing.Size(530, 20);
            this.txtAdPassword.TabIndex = 5;
            // 
            // lblAdBaseDn
            // 
            this.lblAdBaseDn.AutoSize = true;
            this.lblAdBaseDn.Location = new System.Drawing.Point(6, 103);
            this.lblAdBaseDn.Name = "lblAdBaseDn";
            this.lblAdBaseDn.Size = new System.Drawing.Size(55, 13);
            this.lblAdBaseDn.TabIndex = 6;
            this.lblAdBaseDn.Text = "Base DN:";
            // 
            // txtAdBaseDn
            // 
            this.txtAdBaseDn.Location = new System.Drawing.Point(120, 100);
            this.txtAdBaseDn.Name = "txtAdBaseDn";
            this.txtAdBaseDn.Size = new System.Drawing.Size(530, 20);
            this.txtAdBaseDn.TabIndex = 7;
            // 
            // gbPlatformSettings
            // 
            this.gbPlatformSettings.Controls.Add(this.lblApiKey);
            this.gbPlatformSettings.Controls.Add(this.txtApiKey);
            this.gbPlatformSettings.Controls.Add(this.lblTenantId);
            this.gbPlatformSettings.Controls.Add(this.txtTenantId);
            this.gbPlatformSettings.Controls.Add(this.lblPlatformUrl);
            this.gbPlatformSettings.Controls.Add(this.txtPlatformUrl);
            this.gbPlatformSettings.Location = new System.Drawing.Point(12, 194);
            this.gbPlatformSettings.Name = "gbPlatformSettings";
            this.gbPlatformSettings.Size = new System.Drawing.Size(660, 110);
            this.gbPlatformSettings.TabIndex = 2;
            this.gbPlatformSettings.TabStop = false;
            this.gbPlatformSettings.Text = "Настройки платформы";
            // 
            // lblPlatformUrl
            // 
            this.lblPlatformUrl.AutoSize = true;
            this.lblPlatformUrl.Location = new System.Drawing.Point(6, 25);
            this.lblPlatformUrl.Name = "lblPlatformUrl";
            this.lblPlatformUrl.Size = new System.Drawing.Size(86, 13);
            this.lblPlatformUrl.TabIndex = 0;
            this.lblPlatformUrl.Text = "URL платформы:";
            // 
            // txtPlatformUrl
            // 
            this.txtPlatformUrl.Location = new System.Drawing.Point(120, 22);
            this.txtPlatformUrl.Name = "txtPlatformUrl";
            this.txtPlatformUrl.Size = new System.Drawing.Size(530, 20);
            this.txtPlatformUrl.TabIndex = 1;
            // 
            // lblTenantId
            // 
            this.lblTenantId.AutoSize = true;
            this.lblTenantId.Location = new System.Drawing.Point(6, 51);
            this.lblTenantId.Name = "lblTenantId";
            this.lblTenantId.Size = new System.Drawing.Size(60, 13);
            this.lblTenantId.TabIndex = 2;
            this.lblTenantId.Text = "Tenant ID:";
            // 
            // txtTenantId
            // 
            this.txtTenantId.Location = new System.Drawing.Point(120, 48);
            this.txtTenantId.Name = "txtTenantId";
            this.txtTenantId.Size = new System.Drawing.Size(530, 20);
            this.txtTenantId.TabIndex = 3;
            // 
            // lblApiKey
            // 
            this.lblApiKey.AutoSize = true;
            this.lblApiKey.Location = new System.Drawing.Point(6, 77);
            this.lblApiKey.Name = "lblApiKey";
            this.lblApiKey.Size = new System.Drawing.Size(59, 13);
            this.lblApiKey.TabIndex = 4;
            this.lblApiKey.Text = "API Ключ:";
            // 
            // txtApiKey
            // 
            this.txtApiKey.Location = new System.Drawing.Point(120, 74);
            this.txtApiKey.Name = "txtApiKey";
            this.txtApiKey.PasswordChar = '*';
            this.txtApiKey.Size = new System.Drawing.Size(530, 20);
            this.txtApiKey.TabIndex = 5;
            // 
            // btnSave
            // 
            this.btnSave.Location = new System.Drawing.Point(12, 310);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(140, 35);
            this.btnSave.TabIndex = 3;
            this.btnSave.Text = "Сохранить настройки";
            this.btnSave.UseVisualStyleBackColor = true;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // btnStart
            // 
            this.btnStart.Location = new System.Drawing.Point(158, 310);
            this.btnStart.Name = "btnStart";
            this.btnStart.Size = new System.Drawing.Size(140, 35);
            this.btnStart.TabIndex = 4;
            this.btnStart.Text = "Запустить агента";
            this.btnStart.UseVisualStyleBackColor = true;
            this.btnStart.Click += new System.EventHandler(this.btnStart_Click);
            // 
            // btnStop
            // 
            this.btnStop.Enabled = false;
            this.btnStop.Location = new System.Drawing.Point(304, 310);
            this.btnStop.Name = "btnStop";
            this.btnStop.Size = new System.Drawing.Size(140, 35);
            this.btnStop.TabIndex = 5;
            this.btnStop.Text = "Остановить агента";
            this.btnStop.UseVisualStyleBackColor = true;
            this.btnStop.Click += new System.EventHandler(this.btnStop_Click);
            // 
            // gbLogs
            // 
            this.gbLogs.Controls.Add(this.txtLog);
            this.gbLogs.Location = new System.Drawing.Point(12, 351);
            this.gbLogs.Name = "gbLogs";
            this.gbLogs.Size = new System.Drawing.Size(660, 200);
            this.gbLogs.TabIndex = 6;
            this.gbLogs.TabStop = false;
            this.gbLogs.Text = "Логи";
            // 
            // txtLog
            // 
            this.txtLog.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txtLog.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.txtLog.Location = new System.Drawing.Point(3, 16);
            this.txtLog.Multiline = true;
            this.txtLog.Name = "txtLog";
            this.txtLog.ReadOnly = true;
            this.txtLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.txtLog.Size = new System.Drawing.Size(654, 181);
            this.txtLog.TabIndex = 0;
            // 
            // lblStatus
            // 
            this.lblStatus.AutoSize = true;
            this.lblStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.lblStatus.ForeColor = System.Drawing.Color.Green;
            this.lblStatus.Location = new System.Drawing.Point(450, 318);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(108, 17);
            this.lblStatus.TabIndex = 7;
            this.lblStatus.Text = "Готов к запуску";
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(684, 563);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.gbLogs);
            this.Controls.Add(this.btnStop);
            this.Controls.Add(this.btnStart);
            this.Controls.Add(this.btnSave);
            this.Controls.Add(this.gbPlatformSettings);
            this.Controls.Add(this.gbAdSettings);
            this.Controls.Add(this.lblTitle);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "AD Sync Agent - Настройка и запуск";
            this.gbAdSettings.ResumeLayout(false);
            this.gbAdSettings.PerformLayout();
            this.gbPlatformSettings.ResumeLayout(false);
            this.gbPlatformSettings.PerformLayout();
            this.gbLogs.ResumeLayout(false);
            this.gbLogs.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}

