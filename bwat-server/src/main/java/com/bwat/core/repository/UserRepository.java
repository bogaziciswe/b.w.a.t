package com.bwat.core.repository;

import com.bwat.core.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    User findById(Long id);
    User findByMail(String mail);
}
