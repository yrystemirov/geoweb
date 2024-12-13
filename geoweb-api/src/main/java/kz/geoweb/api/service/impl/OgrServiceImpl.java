package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.OgrInfoDto;
import kz.geoweb.api.enums.LayerFormat;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.OgrService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static kz.geoweb.api.utils.GisConstants.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OgrServiceImpl implements OgrService {

    @Value("${spring.datasource.url}")
    private String dbUrl;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;

    private static final String OGR_2_OGR = "/usr/bin/ogr2ogr";
    private static final String OGR_INFO = "/usr/bin/ogrinfo";

    @Override
    public void importLayersFile(MultipartFile file, LayerFormat layerFormat) {
        String baseFolderPath = "/tmp";
        File baseFolder = new File(baseFolderPath);

        if (!baseFolder.exists()) {
            baseFolder.mkdirs();
        }

        String zipFilePath = baseFolderPath + "/" + file.getOriginalFilename();
        File zipFile = new File(zipFilePath);
        try (OutputStream os = new FileOutputStream(zipFile)) {
            os.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error while reading file: " + e);
            throw new CustomException("Error while reading file: " + e.getMessage());
        }

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
            log.error("Error while unzipping: " + e);
            throw new CustomException("Error while unzipping: " + e.getMessage());
        }

        log.info("UNZIPPED SUCESSFULLY");

        String ogrInfo = getOgrInfo(extractFolderPath);
        log.info("OGR INFO: " + ogrInfo);
        List<OgrInfoDto> ogrInfoDtoList = parseOgrInfo(layerFormat, ogrInfo);
        log.info("OGR INFO DTO COUNT: " + ogrInfoDtoList.size());
        if (ogrInfoDtoList.isEmpty()) {
            throw new CustomException("No layers found in this file");
        }
        for (OgrInfoDto ogrInfoDto : ogrInfoDtoList) {
            importLayer(extractFolderPath, ogrInfoDto.getGeomType(), ogrInfoDto.getLayername());
        }
    }

    public void importLayer(String extractFolderPath, String geometryType, String layername) {
        log.info("START IMPORT LAYER: " + layername);

        try {
            String[] cmdArr = getOgrInfoCmdArr(extractFolderPath, geometryType, layername);
            ProcessBuilder processBuilder = new ProcessBuilder(cmdArr);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            StringWriter sw = new StringWriter();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info(line);
                    sw.append(line);
                    sw.append("\n");
                }
            }
            String ogrLog = sw.toString();
            int code = process.waitFor();
            if (code != 0) {
                throw new CustomException("Error while processing ogr2ogr command: " + ogrLog);
            }
        } catch (Exception e) {
            log.error("Error while importing: " + e);
            throw new CustomException("Error while importing: " + e.getMessage());
        }

        log.info("IMPORTED SUCCESSFULLY: " + layername);
    }

    private String[] getOgrInfoCmdArr(String extractFolderPath, String geometryType, String layername) {
        String[] parts = dbUrl.split("://")[1].split("/");
        String hostPortPart = parts[0];
        String[] hostPort = hostPortPart.split(":");
        String dbHost = hostPort[0];
        int dbPort = Integer.parseInt(hostPort[1]);
        String dbName = parts[1];
        String postgis = String.format("PG:dbname=%s host=%s port=%s user=%s password=%s", dbName, dbHost, dbPort, username, password);
        return new String[]{
                OGR_2_OGR,
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
    }

    public String getOgrInfo(String filePath) {
        try {
            String[] arr = {OGR_INFO, filePath};
            ProcessBuilder processBuilder = new ProcessBuilder(arr);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (IOException e) {
            log.error("Error while fetching ogrinfo: " + e);
            throw new CustomException("Error while fetching ogrinfo: " + e.getMessage());
        }
    }

    private List<OgrInfoDto> parseOgrInfo(LayerFormat layerFormat, String text) {
        String shpRegex = "\\d+: (.*?) \\((.*?)\\)";
        String gdbRegex = "Layer: (.*?) \\((.*?)\\)";
        String kmlRegex = "\\d+: (.*?) \\((.*?)\\)";
        String regex = switch (layerFormat) {
            case SHP -> shpRegex;
            case GDB -> gdbRegex;
            case KML -> kmlRegex;
        };
        List<OgrInfoDto> ogrInfoDtoList = new ArrayList<>();
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            OgrInfoDto ogrInfoDto = new OgrInfoDto(
                    matcher.group(1).trim(),
                    matcher.group(2).trim().toUpperCase()
            );
            ogrInfoDtoList.add(ogrInfoDto);
            log.info("ogrinfo: " + ogrInfoDto.getLayername() + ", " + ogrInfoDto.getGeomType());
        }
        return ogrInfoDtoList;
    }
}
