package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken extends IdEntity {
    private String username;
    private String token;
    private LocalDateTime expiry;
}
