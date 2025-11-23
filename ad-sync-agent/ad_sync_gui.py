#!/usr/bin/env python3
"""
AD Sync Agent - GUI приложение
Простой интерфейс для настройки и запуска AD Sync Agent
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import os
import subprocess
import threading
import sys
from pathlib import Path
from dotenv import load_dotenv, set_key, get_key

# Загружаем .env если есть
env_path = Path('.env')
if env_path.exists():
    load_dotenv(env_path)

class AdSyncGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("AD Sync Agent - Настройка и запуск")
        self.root.geometry("700x750")
        self.root.resizable(False, False)
        
        # Процесс агента
        self.agent_process = None
        self.agent_running = False
        
        # Создаём интерфейс
        self.create_widgets()
        self.load_config()
        
    def create_widgets(self):
        # Главный контейнер
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Заголовок
        title_label = ttk.Label(main_frame, text="AD Sync Agent", 
                               font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Настройки Active Directory
        ad_frame = ttk.LabelFrame(main_frame, text="Настройки Active Directory", padding="10")
        ad_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(ad_frame, text="AD Сервер:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.ad_host = ttk.Entry(ad_frame, width=50)
        self.ad_host.grid(row=0, column=1, pady=5, padx=5)
        self.ad_host.insert(0, os.getenv('AD_HOST', 'ldap://your-server:389'))
        
        ttk.Label(ad_frame, text="Пользователь:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.ad_username = ttk.Entry(ad_frame, width=50)
        self.ad_username.grid(row=1, column=1, pady=5, padx=5)
        self.ad_username.insert(0, os.getenv('AD_USERNAME', ''))
        
        ttk.Label(ad_frame, text="Пароль:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.ad_password = ttk.Entry(ad_frame, width=50, show="*")
        self.ad_password.grid(row=2, column=1, pady=5, padx=5)
        self.ad_password.insert(0, os.getenv('AD_PASSWORD', ''))
        
        ttk.Label(ad_frame, text="Base DN:").grid(row=3, column=0, sticky=tk.W, pady=5)
        self.ad_base_dn = ttk.Entry(ad_frame, width=50)
        self.ad_base_dn.grid(row=3, column=1, pady=5, padx=5)
        self.ad_base_dn.insert(0, os.getenv('AD_BASE_DN', 'DC=domain,DC=local'))
        
        # Настройки платформы
        platform_frame = ttk.LabelFrame(main_frame, text="Настройки платформы", padding="10")
        platform_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(platform_frame, text="URL платформы:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.platform_url = ttk.Entry(platform_frame, width=50)
        self.platform_url.grid(row=0, column=1, pady=5, padx=5)
        self.platform_url.insert(0, os.getenv('PLATFORM_URL', 'https://your-platform.com'))
        
        ttk.Label(platform_frame, text="Tenant ID:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.tenant_id = ttk.Entry(platform_frame, width=50)
        self.tenant_id.grid(row=1, column=1, pady=5, padx=5)
        self.tenant_id.insert(0, os.getenv('TENANT_ID', ''))
        
        ttk.Label(platform_frame, text="API Ключ:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.api_key = ttk.Entry(platform_frame, width=50, show="*")
        self.api_key.grid(row=2, column=1, pady=5, padx=5)
        self.api_key.insert(0, os.getenv('API_KEY', ''))
        
        # Кнопки управления
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=3, column=0, columnspan=2, pady=20)
        
        self.save_button = ttk.Button(button_frame, text="💾 Сохранить настройки", 
                                     command=self.save_config, width=25)
        self.save_button.pack(side=tk.LEFT, padx=5)
        
        self.start_button = ttk.Button(button_frame, text="▶ Запустить агента", 
                                      command=self.start_agent, width=25, state=tk.NORMAL)
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.stop_button = ttk.Button(button_frame, text="⏹ Остановить агента", 
                                      command=self.stop_agent, width=25, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=5)
        
        # Логи
        log_frame = ttk.LabelFrame(main_frame, text="Логи", padding="10")
        log_frame.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=15, width=80)
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        # Статус
        self.status_label = ttk.Label(main_frame, text="Готов к запуску", 
                                     foreground="green", font=("Arial", 10, "bold"))
        self.status_label.grid(row=5, column=0, columnspan=2, pady=10)
        
    def log(self, message):
        """Добавить сообщение в логи"""
        self.log_text.insert(tk.END, f"{message}\n")
        self.log_text.see(tk.END)
        self.root.update_idletasks()
        
    def load_config(self):
        """Загрузить настройки из .env файла"""
        if env_path.exists():
            self.log("Загружены настройки из .env файла")
        else:
            self.log("Файл .env не найден. Используются значения по умолчанию.")
            
    def save_config(self):
        """Сохранить настройки в .env файл"""
        try:
            config = {
                'AD_HOST': self.ad_host.get().strip(),
                'AD_USERNAME': self.ad_username.get().strip(),
                'AD_PASSWORD': self.ad_password.get().strip(),
                'AD_BASE_DN': self.ad_base_dn.get().strip(),
                'PLATFORM_URL': self.platform_url.get().strip(),
                'TENANT_ID': self.tenant_id.get().strip(),
                'API_KEY': self.api_key.get().strip(),
                'AD_USER_SEARCH_BASE': os.getenv('AD_USER_SEARCH_BASE', 'CN=Users,DC=domain,DC=local'),
                'AD_USER_SEARCH_FILTER': os.getenv('AD_USER_SEARCH_FILTER', '(objectClass=user)'),
                'AD_USE_SSL': os.getenv('AD_USE_SSL', 'false'),
                'SYNC_INTERVAL': os.getenv('SYNC_INTERVAL', '3600'),
            }
            
            # Проверяем обязательные поля
            required = ['AD_HOST', 'AD_USERNAME', 'AD_PASSWORD', 'AD_BASE_DN', 
                       'PLATFORM_URL', 'TENANT_ID', 'API_KEY']
            missing = [field for field in required if not config[field] or 
                      'your-' in config[field].lower() or 'your_' in config[field].lower()]
            
            if missing:
                messagebox.warning(self.root, 
                    "Заполните все поля!", 
                    f"Не заполнены обязательные поля: {', '.join(missing)}")
                return
            
            # Сохраняем в .env
            for key, value in config.items():
                set_key(env_path, key, value)
            
            self.log("✅ Настройки сохранены в .env файл")
            messagebox.showinfo("Успех", "Настройки успешно сохранены!")
            
        except Exception as e:
            self.log(f"❌ Ошибка при сохранении: {e}")
            messagebox.showerror("Ошибка", f"Не удалось сохранить настройки:\n{e}")
    
    def start_agent(self):
        """Запустить агента"""
        if self.agent_running:
            messagebox.showwarning("Внимание", "Агент уже запущен!")
            return
            
        # Проверяем наличие .env
        if not env_path.exists():
            messagebox.warning(self.root, 
                "Файл .env не найден!", 
                "Сначала сохраните настройки!")
            return
        
        # Проверяем наличие скрипта агента
        agent_script = Path('ad_sync_agent.py')
        
        # Если запущено из .exe, ищем скрипт рядом с .exe
        if getattr(sys, 'frozen', False):
            # Запущено из .exe
            exe_dir = Path(sys.executable).parent
            agent_script = exe_dir / 'ad_sync_agent.py'
        
        if not agent_script.exists():
            # Пробуем найти в текущей директории
            agent_script = Path.cwd() / 'ad_sync_agent.py'
            if not agent_script.exists():
                messagebox.showerror("Ошибка", 
                    "Файл ad_sync_agent.py не найден!\n\n"
                    "Убедитесь, что файл ad_sync_agent.py находится:\n"
                    "1. В той же папке, что и AD-Sync-Agent.exe\n"
                    "2. Или в папке, откуда вы запустили программу")
                return
        
        try:
            self.log("🚀 Запуск агента...")
            self.status_label.config(text="Агент запущен...", foreground="orange")
            
            # Определяем путь к Python и скрипту
            if getattr(sys, 'frozen', False):
                # Запущено из .exe (standalone)
                # ad_sync_agent.py должен быть рядом с .exe
                exe_dir = Path(sys.executable).parent
                script_path = exe_dir / 'ad_sync_agent.py'
                
                if not script_path.exists():
                    messagebox.showerror("Ошибка", 
                        f"Файл ad_sync_agent.py не найден!\n\n"
                        f"Поместите файл ad_sync_agent.py в ту же папку,\n"
                        f"где находится AD-Sync-Agent.exe:\n\n"
                        f"{exe_dir}\n\n"
                        f"Файл ad_sync_agent.py должен быть в архиве.")
                    return
                
                # Для standalone .exe используем системный Python
                # (агент должен быть запущен отдельным процессом)
                python_exe = 'python'
                
            else:
                # Запущено из Python
                python_exe = sys.executable
                script_path = Path('ad_sync_agent.py')
                
                if not script_path.exists():
                    messagebox.showerror("Ошибка", 
                        "Файл ad_sync_agent.py не найден!\n\n"
                        "Убедитесь, что вы запускаете программу\n"
                        "из правильной папки.")
                    return
            
            # Запускаем агента в отдельном процессе
            self.agent_process = subprocess.Popen(
                [python_exe, str(script_path)],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1,
                cwd=str(script_path.parent)
            )
            
            self.agent_running = True
            self.start_button.config(state=tk.DISABLED)
            self.stop_button.config(state=tk.NORMAL)
            
            # Читаем вывод в отдельном потоке
            threading.Thread(target=self.read_agent_output, daemon=True).start()
            
            self.log("✅ Агент успешно запущен!")
            self.status_label.config(text="🟢 Агент работает...", foreground="green")
            
        except Exception as e:
            self.log(f"❌ Ошибка при запуске: {e}")
            messagebox.showerror("Ошибка", f"Не удалось запустить агента:\n{e}")
            self.agent_running = False
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)
    
    def read_agent_output(self):
        """Читать вывод агента"""
        if not self.agent_process:
            return
            
        try:
            for line in self.agent_process.stdout:
                if line:
                    self.root.after(0, self.log, line.strip())
        except Exception as e:
            self.log(f"Ошибка чтения вывода: {e}")
        finally:
            self.agent_process = None
            self.agent_running = False
            self.root.after(0, self.on_agent_stopped)
    
    def stop_agent(self):
        """Остановить агента"""
        if not self.agent_running or not self.agent_process:
            return
            
        try:
            self.log("⏹ Остановка агента...")
            self.agent_process.terminate()
            
            # Ждём завершения
            try:
                self.agent_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.agent_process.kill()
            
            self.log("✅ Агент остановлен")
            self.on_agent_stopped()
            
        except Exception as e:
            self.log(f"❌ Ошибка при остановке: {e}")
    
    def on_agent_stopped(self):
        """Вызывается когда агент остановлен"""
        self.agent_running = False
        self.agent_process = None
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        self.status_label.config(text="Агент остановлен", foreground="red")

def main():
    root = tk.Tk()
    app = AdSyncGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()

