package kz.geoweb.api.listeners;

import kz.geoweb.api.service.GeoserverService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeoserverInitListener {
    private final GeoserverService geoserverService;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeGeoserverResources() {
        geoserverService.createWorkspaceIfNotExists();
        geoserverService.createDatastoreIfNotExists();
    }
}
