package com.pbl5.autoattendance.embedded;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AuthorityId implements Serializable {
    private String username;
    private String authority;
}

