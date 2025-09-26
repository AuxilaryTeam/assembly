package com.bankofabyssinia.assembly_vote_service.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.bankofabyssinia.assembly_vote_service.Entity.ShareHolderDetailForPrint;
import com.bankofabyssinia.assembly_vote_service.Repository.ShareHolderDetailForPrintRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
public class ShareHolderDetailForPrintController {

    // Add endpoint methods here
    @Autowired
    public ShareHolderDetailForPrintRepository repository;


    @GetMapping("/admin/phone/{phone}")
    public List<ShareHolderDetailForPrint> findByPhoneStartsWith(@RequestParam String phone) {
        return repository.findByPhoneStartsWith(phone);
    }

    @GetMapping("/admin/name/{name}")
    public List<ShareHolderDetailForPrint> findByNameengStartsWith(@RequestParam String name) {
        return repository.findByNameengStartsWith(name);
    }

    @GetMapping("/admin/shareid/{shareid}")
    public List<ShareHolderDetailForPrint> findByShareholderid(@RequestParam String shareid) {
        return repository.findByShareholderid(shareid);
    }


    @GetMapping("/admin/person/{id}")
    public Optional<ShareHolderDetailForPrint> findByPersonId(@RequestParam Long id) {
        return repository.findById(id);
    }
    

}