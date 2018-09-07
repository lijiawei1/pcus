package org.pcus.auth.security;

import lombok.extern.slf4j.Slf4j;
import org.pcus.auth.entity.SysUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

/**
 * Created by wangyunfei on 2017/6/9.
 */
//@Service("userDetailsService")
@Slf4j
public class DomainUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String lowcaseUsername = username.toLowerCase();
        //Optional<SysUser> realUser = sysUserRepository.findOneWithRolesByUsername(lowcaseUsername);
        Optional<SysUser> realUser = findOneWithRolesByUsername(lowcaseUsername);

        return realUser.map(user -> {
            Set<GrantedAuthority> grantedAuthorities = user.getAuthorities();
            return new User(user.getUsername(),user.getPassword(),grantedAuthorities);
        }).orElseThrow(() -> new UsernameNotFoundException("用户" + lowcaseUsername + "不存在!"));
    }

    private Optional<SysUser> findOneWithRolesByUsername(String lowcaseUsername) {

        SysUser sysUser = new SysUser();
        sysUser.setUsername(lowcaseUsername);
        if ("admin".equals(lowcaseUsername)) {
            sysUser.getAuthorities().add(new SimpleGrantedAuthority("ADMIN"));
        }
        if ("lijw".equals(lowcaseUsername)) {
            sysUser.getAuthorities().add(new SimpleGrantedAuthority("USER"));
        }
        return Stream.of(sysUser).findAny();
    }
}
