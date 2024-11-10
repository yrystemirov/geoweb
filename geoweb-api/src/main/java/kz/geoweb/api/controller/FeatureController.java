package kz.geoweb.api.controller;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.service.FeatureService;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.OgrService;
import kz.geoweb.api.utils.HttpUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
@Slf4j
public class FeatureController {
    private final FeatureService featureService;
    private final JdbcService jdbcService;
    private final OgrService ogrService;

    @PostMapping
    public void save(@RequestParam String layername,
                     @RequestBody List<FeatureSaveDto> featureSaveDtoList) {
        featureService.save(layername, featureSaveDtoList);
    }

    @GetMapping
    public Page<Map<String, Object>> getFeatures(@RequestParam String layername, Pageable pageable) {
        return featureService.getFeatures(layername, pageable);
    }

    @PostMapping("/identify")
    public List<IdentifyResponseDto> identify(@RequestBody WmsRequestDto wmsRequestDto) {
        return featureService.identify(wmsRequestDto);
    }

    @GetMapping("/files")
    public List<FeatureFileDto> getFeatureFiles(@RequestParam String layername,
                                                @RequestParam Integer gid) {
        return featureService.getFeatureFiles(layername, gid);
    }

    @PostMapping("/files/upload")
    public FeatureFileDto createFeatureFile(@RequestParam MultipartFile file,
                                            @RequestParam String layername,
                                            @RequestParam Integer gid) throws IOException {
        return featureService.uploadFeatureFile(file.getBytes(), file.getOriginalFilename(), layername, gid);
    }

    @GetMapping("/files/download")
    public ResponseEntity<byte[]> downloadFeatureFile(@RequestParam UUID id) {
        FeatureFileResponseDto featureFileResponseDto = featureService.downloadFeatureFile(id);

        HttpHeaders headers = HttpUtils.getDownloadHeaders(featureFileResponseDto.getFilename(),
                featureFileResponseDto.getContentType(), featureFileResponseDto.getSize());
        return new ResponseEntity<>(featureFileResponseDto.getFile(), headers, HttpStatus.OK);
    }

    @GetMapping("/test")
    public Boolean test(@RequestParam String tableName) {
        return jdbcService.tableExists(tableName);
    }

    @GetMapping("/testogr")
    public void testOgr(@RequestParam String folder,
                        @RequestParam String geometryType,
                        @RequestParam String layername) {
        log.info("Importing file");
//        ogrService.importFile("/opt/geoserver_import_files/Esilski_vodohoziaistvenn.gdb.zip", "rivers", "POINT");
        ogrService.runOgr2OgrCommand(folder, geometryType, layername);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> runOgr2OgrCommandUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("geometryType") String geometryType,
            @RequestParam("layername") String layername) {
        log.info("Importing file upload");
        try {
            ogrService.runOgr2OgrCommandUpload(file, geometryType, layername);
            return ResponseEntity.ok("Команда ogr2ogr успешно выполнена.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при выполнении команды ogr2ogr.");
        }
    }

    @GetMapping("/testogrversion")
    public String testOgrVersion() {
        return ogrService.getOgr2ogrVersion();
    }

    @GetMapping("/testogrinfo")
    public String testOgrInfo(@RequestParam String filePath) {
        return ogrService.getOgr2ogrVersion(filePath);
    }
}
