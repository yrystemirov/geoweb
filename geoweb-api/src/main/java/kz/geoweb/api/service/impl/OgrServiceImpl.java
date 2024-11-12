package kz.geoweb.api.service.impl;

import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.OgrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static kz.geoweb.api.utils.GisConstants.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OgrServiceImpl implements OgrService {

    private final JdbcService jdbcService;

    @Value("${spring.datasource.url}")
    private String dbUrl;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;

//    @Value("${app.geoserver.import-files.path}")
//    private String importFilesPath;

    private static final String OGR_INFO = "/usr/bin/ogr2ogr";
    private static final String OGR2OGR = "C:\\OSGeo4W\\bin\\ogr2ogr.exe";
    private static final String F = "-f";
    private static final String POSTGRESQL = "PostgreSQL";
    private static final String LCO = "-lco";
    private static final String GEOMETRY_NAME = "GEOMETRY_NAME=geom";
    private static final String FID = "FID=gid";
    private static final String INDEX = "SPATIAL_INDEX=GIST";
    private static final String SCHEMA = "SCHEMA=layers";
    private static final String NLN = "-nln";
    private static final String NLT = "-nlt";
    private static final String PRECISION = "PRECISION=NO";
    private static final String ORGANIZE_POLYGONS = "OGR_ORGANIZE_POLYGONS=CCW_INNER_JUST_AFTER_CW_OUTER";

    @Override
    public Integer importFile(String filePath, String layername, String geometryType) {
        try {
            String[] parts = dbUrl.split("://")[1].split("/");
            String hostPortPart = parts[0];
            String[] hostPort = hostPortPart.split(":");
            String dbHost = hostPort[0];
            int dbPort = Integer.parseInt(hostPort[1]);
            String dbName = parts[1];
            String postgis = String.format("PG:dbname=%s host=%s port=%s user=%s password=%s",
                    dbName, dbHost, dbPort, username, password);
            log.info("Postgis: {}", postgis);

            String[] cmdArr = new String[]{OGR2OGR, F, POSTGRESQL, postgis, filePath, layername, LCO, GEOMETRY_NAME,
                    NLT, geometryType.trim().toUpperCase().replaceAll("\\s|2D|3D|MEASURED", ""),
                    LCO, FID, LCO, SCHEMA, LCO, PRECISION, LCO, INDEX, LCO, ORGANIZE_POLYGONS, NLN, layername};

            // /opt/geoserver/data_dir/gdb/Esilski_vodohoziaistvenn.gdb.zip

            String[] newCmdArr = new String[] {
                    "ogr2ogr -f PostgreSQL PG:\"host=geoweb_db port=5432 dbname=geowebdb user=geoweb_admin password=geoweb123\" \"" + filePath + "\" " +
                            "-lco GEOMETRY_NAME=geom -lco FID=gid -lco SCHEMA=layers -lco PRECISION=NO -lco SPATIAL_INDEX=GIST -lco OGR_ORGANIZE_POLYGONS=CCW_INNER_JUST_AFTER_CW_OUTER -nln imported_roads_2"
            };

            String cmdString = String.join(" ", newCmdArr);
            log.info("ogr2ogr command: {}", cmdString);

            ProcessBuilder processBuilder = new ProcessBuilder(newCmdArr);
            processBuilder.redirectErrorStream(true);
            processBuilder.directory(new File("/usr/bin"));
            Process process = processBuilder.start();
//            process.waitFor(10, TimeUnit.SECONDS);
//            if (!jdbcService.tableExists(layername)) {
//                BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
//                String err = br.lines().collect(Collectors.joining(System.lineSeparator()));
//                throw new CustomException(err);
//            }

            // Чтение вывода процесса
            log.info("Чтение вывода процесса");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("ogr2ogr output: {}", line);  // Выводим каждый лог
                }
            }

            // Ожидание завершения процесса
            log.info("Ожидание завершения процесса");
            boolean finished = process.waitFor(10, TimeUnit.SECONDS);

            if (!finished) {
                log.error("Процесс импорта завершился с таймаутом");
                return 0;
            }

            int exitCode = process.exitValue();
            log.info("ogr2ogr процесс завершился с кодом: {}", exitCode);

            if (exitCode != 0) {
                throw new CustomException("ogr2ogr завершился с ошибкой.");
            }

            return 1;
        } catch (IOException | InterruptedException e) {
            throw new CustomException("Ошибка при импорте слоя. " + e.getMessage());
        }
    }

    private String getInfo(String filePath) throws CustomException {
        try {
            String[] arr = {OGR_INFO, filePath};
            ProcessBuilder processBuilder = new ProcessBuilder(arr);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (IOException e) {
            throw new CustomException("Ошибка при получении информации от ogrinfo. " + e.getMessage());
        }
    }

    public void runOgr2OgrCommand(String folder, String geometryType, String layername) {
        try {

            String[] parts = dbUrl.split("://")[1].split("/");
            String hostPortPart = parts[0];
            String[] hostPort = hostPortPart.split(":");
            String dbHost = hostPort[0];
            int dbPort = Integer.parseInt(hostPort[1]);
            String dbName = parts[1];
            String postgis = String.format("\"PG:host=%s port=%s dbname=%s user=%s password=%s\"", dbHost, dbPort, dbName, username, password);
            log.info("Postgis: {}", postgis);

//            String importFolder = String.format("\"%s/%s/%s\"", "/opt/geoserver_import_files", folder, folder);
//            log.info("Import folder: {}", importFolder);
            log.info("Import folder path: {}", folder);

            String[] cmdArr = new String[] {
                    OGR_INFO,
                    "-f", "PostgreSQL",
                    postgis, folder,
                    "-lco", "GEOMETRY_NAME=" + GEOM,
                    "-nlt", geometryType,
                    "-lco", "FID=" + GID,
                    "-lco", "SCHEMA=" + LAYERS_SCHEMA,
                    "-lco", "PRECISION=NO",
                    "-lco", "SPATIAL_INDEX=GIST",
                    "-nln", layername
            };
            log.info("ogr2ogr command: {}", String.join(" ", cmdArr));

            ProcessBuilder processBuilder = new ProcessBuilder(cmdArr);
            processBuilder.redirectErrorStream(true);
            processBuilder.directory(new File("/usr/bin"));
            Process process = processBuilder.start();

            // Чтение вывода
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);  // или log.info(line);
                }
            }

            int exitCode = process.waitFor();
            System.out.println("ogr2ogr завершен с кодом: " + exitCode);
            if (exitCode != 0) {
                System.err.println("Ошибка выполнения команды ogr2ogr.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void runOgr2OgrCommandUpload(MultipartFile file, String geometryType, String layername) {
        String baseFolderPath = "/tmp/test_import_files";
        File baseFolder = new File(baseFolderPath);

        // Создать директорию, если она не существует
        if (!baseFolder.exists()) {
            baseFolder.mkdirs();
        }

        // Сохранить файл .zip
        String zipFilePath = baseFolderPath + "/" + file.getOriginalFilename();
        File zipFile = new File(zipFilePath);
        try (OutputStream os = new FileOutputStream(zipFile)) {
            os.write(file.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        // Разархивировать файл .zip
        String folderName = zipFile.getName().replace(".zip", "");
        String extractFolderPath = baseFolderPath + "/" + folderName + "/" + folderName;
        File extractFolder = new File(extractFolderPath);
        if (!extractFolder.exists()) {
            extractFolder.mkdirs();
        }

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry zipEntry;
            while ((zipEntry = zis.getNextEntry()) != null) {
                File newFile = new File(extractFolderPath, zipEntry.getName());
                if (zipEntry.isDirectory()) {
                    newFile.mkdirs();
                } else {
                    new File(newFile.getParent()).mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        // Использовать разархивированную папку в команде ogr2ogr
        try {
            String[] parts = dbUrl.split("://")[1].split("/");
            String hostPortPart = parts[0];
            String[] hostPort = hostPortPart.split(":");
            String dbHost = hostPort[0];
            int dbPort = Integer.parseInt(hostPort[1]);
            String dbName = parts[1];
            String postgis = String.format("\"PG:host=%s port=%s dbname=%s user=%s password=%s\"", dbHost, dbPort, dbName, username, password);
            log.info("Postgis: {}", postgis);

            String[] cmdArr = new String[]{
                    OGR_INFO,
                    "-f", "PostgreSQL",
                    postgis, extractFolderPath,
                    "-lco", "GEOMETRY_NAME=" + GEOM,
                    "-nlt", geometryType,
                    "-lco", "FID=" + GID,
                    "-lco", "SCHEMA=" + LAYERS_SCHEMA,
                    "-lco", "PRECISION=NO",
                    "-lco", "SPATIAL_INDEX=GIST",
                    "-nln", layername
            };
            log.info("ogr2ogr command: {}", String.join(" ", cmdArr));

            ProcessBuilder processBuilder = new ProcessBuilder(cmdArr);
            processBuilder.redirectErrorStream(true);
            processBuilder.directory(new File("/usr/bin"));
            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);  // или log.info(line);
                }
            }

            int exitCode = process.waitFor();
            System.out.println("ogr2ogr завершен с кодом: " + exitCode);
            if (exitCode != 0) {
                System.err.println("Ошибка выполнения команды ogr2ogr.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getOgr2ogrVersion() {
        StringBuilder result = new StringBuilder();

        try {
            // Создаем процесс для выполнения команды
            ProcessBuilder processBuilder = new ProcessBuilder("/usr/bin/ogr2ogr", "--version");
            processBuilder.redirectErrorStream(true);
            processBuilder.directory(new File("/usr/bin"));

            Process process = processBuilder.start();

            // Чтение вывода команды
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Ошибка выполнения команды ogr2ogr --version, код завершения: " + exitCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Ошибка: " + e.getMessage();
        }

        return result.toString().trim();
    }

    public String getOgr2ogrVersion(String filePath) {
        try {
            String[] arr = {"ogrinfo", filePath};
            log.info("ogrinfo command: {}", String.join(" ", arr));
            ProcessBuilder processBuilder = new ProcessBuilder(arr);
            processBuilder.redirectErrorStream(true);
            processBuilder.directory(new File("/usr/bin"));
            Process process = processBuilder.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (IOException e) {
            throw new CustomException("Ошибка при получении информации от ogrinfo. " + e.getMessage());
        }
    }
}
