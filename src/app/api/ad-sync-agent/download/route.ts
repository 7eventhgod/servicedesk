import { NextRequest, NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import { join } from "path";
import archiver from "archiver";
import { Readable } from "stream";

/**
 * GET /api/ad-sync-agent/download - Download AD sync agent as ZIP archive
 */
export async function GET(request: NextRequest) {
  try {
    const agentDir = join(process.cwd(), "ad-sync-agent");
    
    // Check if agent directory exists
    try {
      await readdir(agentDir);
    } catch (error) {
      return NextResponse.json(
        { error: "AD sync agent not found" },
        { status: 404 }
      );
    }

    // Файлы для включения в архив
    const files = [
      "ad_sync_agent.py",        // Основной агент (нужен для работы)
      "ad_sync_gui.py",          // GUI приложение Python (альтернатива)
      "requirements.txt",        // Зависимости Python
      ".env.example",            // Пример конфигурации
      "build-simple.bat",        // Скрипт сборки Python .exe
      "build-standalone-exe.bat", // Альтернативный скрипт сборки
      "QUICK-START.txt",         // Простая инструкция
      "START-HERE.txt",          // Самый простой старт
      "README.md",               // Полная документация
      "README-STANDALONE.md",    // Инструкция для standalone .exe
    ];
    
    // Add .NET Framework version files
    const netFiles = [
      "net/ADSyncAgent.sln",
      "net/ADSyncAgent/ADSyncAgent.csproj",
      "net/ADSyncAgent/Program.cs",
      "net/ADSyncAgent/MainForm.cs",
      "net/ADSyncAgent/MainForm.Designer.cs",
      "net/ADSyncAgent/MainForm.resx",
      "net/ADSyncAgent/App.config",
      "net/ADSyncAgent/Properties/AssemblyInfo.cs",
      "net/ADSyncAgent/Properties/Resources.resx",
      "net/ADSyncAgent/Properties/Resources.Designer.cs",
      "net/ADSyncAgent/Properties/Settings.settings",
      "net/ADSyncAgent/Properties/Settings.Designer.cs",
      "net/build.bat",
      "net/BUILD-SIMPLE.bat",
      "net/README.md",
      "net/HOW-TO-BUILD.txt",
    ];
    
    // Проверяем наличие готового .exe файла (приоритет!)
    const distDir = join(agentDir, "dist");
    let executableFile: string | null = null;
    
    try {
      const distFiles = await readdir(distDir);
      // Ищем готовый .exe файл
      const exeFile = distFiles.find(f => 
        f.toLowerCase() === "ad-sync-agent.exe" ||
        f.toLowerCase().endsWith(".exe")
      );
      
      if (exeFile) {
        executableFile = join("dist", exeFile);
        console.log(`[AD Sync Agent] Found pre-built executable: ${exeFile}`);
      }
    } catch (error) {
      // dist directory doesn't exist, no pre-built executables
      console.log("[AD Sync Agent] No pre-built executable found");
    }
    
    // Если есть готовый .exe - включаем только его и минимальные файлы
    const allFiles = executableFile 
      ? [
          executableFile,  // Готовый .exe (главный файл!)
          "ad_sync_agent.py",  // Нужен для работы .exe
          ".env.example",      // Пример конфигурации
          "QUICK-START.txt",   // Инструкция для пользователя
        ]
      : files;  // Если нет .exe - включаем все файлы для сборки

    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // Collect all chunks
    const chunks: Buffer[] = [];
    
    // Set up event handlers before adding files
    archive.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // Read base files and add to archive
    for (const file of allFiles) {
      try {
        const filePath = join(agentDir, file);
        const content = await readFile(filePath);
        
        // Для файлов из dist/ - убираем "dist/" из пути в архиве
        // Чтобы .exe был в корне архива
        let archiveName = file.startsWith("dist/") 
          ? file.replace("dist/", "") 
          : file;
        
        // Если это готовый .exe - называем его просто "AD-Sync-Agent.exe"
        if (archiveName.toLowerCase().endsWith(".exe")) {
          archiveName = "AD-Sync-Agent.exe";
        }
        
        archive.append(content, { name: archiveName });
      } catch (error) {
        // File not found, skip
        console.warn(`[AD Sync Agent] File ${file} not found, skipping...`);
      }
    }
    
    // Read .NET Framework version files and add to archive
    for (const file of netFiles) {
      try {
        const filePath = join(agentDir, file);
        const content = await readFile(filePath);
        // Keep net/ prefix in archive
        archive.append(content, { name: file });
      } catch (error) {
        // File not found, skip (optional .NET version)
        console.warn(`[AD Sync Agent] File ${file} not found, skipping...`);
      }
    }

    // Finalize archive and wait for completion
    archive.finalize();

    // Wait for archive to finish
    await new Promise<void>((resolve, reject) => {
      archive.on("end", () => resolve());
      archive.on("error", (err) => reject(err));
    });

    const zipBuffer = Buffer.concat(chunks);

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=ad-sync-agent.zip",
        "Content-Length": zipBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("[AD Sync Agent Download Error]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

