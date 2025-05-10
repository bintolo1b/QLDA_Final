package com.pbl5.autoattendance.model;

import com.pbl5.autoattendance.embedded.AuthorityId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "authority")
public class Authority {
    @EmbeddedId
    private AuthorityId id;

    @MapsId("username")
    @ManyToOne
    @JoinColumn(name = "username", nullable = false)
    private User user;
}
