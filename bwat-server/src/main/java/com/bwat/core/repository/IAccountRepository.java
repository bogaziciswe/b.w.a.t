package com.bwat.core.repository;

import com.bwat.core.document.AccountDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAccountRepository extends MongoRepository<AccountDocument, ObjectId> {
    AccountDocument findById(ObjectId id);
}
