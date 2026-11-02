package com.uniguideAI.security;

import com.uniguideAI.entity.Student;
import com.uniguideAI.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = studentRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found with email: " + username));
        
        String role = student.getRole() != null ? student.getRole() : "ROLE_STUDENT";
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return new User(student.getEmail(), student.getPassword(), 
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(role)));
    }
}

