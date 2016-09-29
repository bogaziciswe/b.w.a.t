package com.bwat.config;

import com.bwat.core.document.AccountDocument;
import com.bwat.core.domain.Account;
import com.bwat.core.repository.IAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;


@Service
public class DataLoader {

    private IAccountRepository accountRepository;

    @Autowired
    public DataLoader(IAccountRepository accountRepository){
        this.accountRepository = accountRepository;
    }

    @PostConstruct
    private void loadData(){
        deleteAllData();
        CreateDummyAccounts();
    }

    private void CreateDummyAccounts() {
        AccountDocument accountDocument1 = new Account("dummy1", "pass", "fds@dsrg.com").ToDocument();
        accountRepository.save(accountDocument1);
    }


    private void deleteAllData() {
        accountRepository.deleteAll();
    }
}