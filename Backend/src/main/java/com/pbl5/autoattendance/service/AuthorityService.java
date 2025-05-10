package com.pbl5.autoattendance.service;

import com.pbl5.autoattendance.model.Authority;
import com.pbl5.autoattendance.repository.AuthorityRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthorityService {
    private final AuthorityRepository authorityRepository;

    public AuthorityService(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    public void saveAuthority(Authority authority) {
        authorityRepository.save(authority);
    }
}
