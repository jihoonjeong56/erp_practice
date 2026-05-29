package com.example.erp.domain.user;

import com.example.erp.common.utils.BaseTimeEntity;
import com.example.erp.domain.user.enums.Role;
import com.example.erp.domain.user.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(unique = true, length = 100)  // 추가
    private String email;

    @Column(length = 20)
    private String provider;

    @Column
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    public User(String username, String password, String name, String email, String provider, String providerId, Role role, UserStatus status) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.providerId = providerId;
        this.role = role;
        this.status = UserStatus.ACTIVE;
    }

    // OAuth2로 이메일 변경될 때를 대비한 업데이트 메서드
    public void updateEmail(String email) {
        this.email = email;
    }
}
